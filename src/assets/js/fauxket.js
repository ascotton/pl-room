/*
  Proxy the Firebase connections, but only if the initial connections fail.
  There are a few things to consider here:
    1. Initially, Firebase connects to <databaseName>.firebaseio.com
    2. That request returns a different Firebase subdomain to connect to, e.g. s-usc1c-nss-221.firebaseio.com
    3. During those requests, a database namespace query argument is used, e.g. ?ns=<databaseName>
    4. The proxy expects the database namespace to be in the subdomain, and the Firebase subdomain to be in the ?fb=<subdomain> query argument.
    5. That is done so we can limit the Firebase database connections that are proxied to only our own, while allowing for Firebase to send us a dynamic subdomain for subsequent connections.
   */
var bind = Function.bind;
var unbind = bind.bind(bind);

var PROXY_ROOT = "fp.presencelearning";
var CONNECTION_LS_KEY = "firebase_last_connection_url";
var FORCE_PROXY_KEY = "firebase_force_proxy";
var MAX_FIREBASE_ATTEMPTS = 1;
var FIREBASE_TIMEOUT = 5000;

// Set firebase_force_proxy for testing or troubleshooting the proxy
var forceFirebaseProxy = !!localStorage.getItem(FORCE_PROXY_KEY);

// We go ahead and clear this to do our best to prevent FB from falling back on long polling
localStorage.removeItem("firebase:previous_websocket_failure");

// The proxy should only ever attempt to connect if Firebase was never reachable in this session.
// If FB was connected, then disconnected, we don't want to go through the proxy.
var firebaseAvailable = false;

function instantiate(constructor, args) {
    return new (unbind(constructor, null).apply(null, args))();
}

WebSocket = (function (WebSocket) {
    CWebSocket.prototype = WebSocket.prototype;
    CWebSocket.CLOSED = 3;
    CWebSocket.CLOSING = 2;
    CWebSocket.CONNECTING = 0;
    CWebSocket.OPEN = 1;
    return CWebSocket;

    function Fauxket(args) {
        /*
          Fauxket is essentially a WebSocket connection manager that will attempt connecting directly to Firebase first,
          and only fall back on the proxy once those connection attempts fail. Because the WebSocket interface does not
          include a `connect` method, and instead connects on construction, there is no way to retry connecting in the
          same WebSocket instance. This means we must create a new WS for each connection attempt.

          To compound this, application code listens to WebSockets based on events. So an event may be tied to the
          WebSocket just before it fails to connect. Fauxket essentially accepts the same interface as WebSocket itself,
          and ensures that event handlers added to it are always re-associated with the active WebSocket.

          Additionally, it captures the onerror and onclose events to retry connections, and only passes them to the
          handler if the final connection attempt fails.
      */
        var fauxket = {
            attempts: 0,
            maxAttempts: MAX_FIREBASE_ATTEMPTS,
            eventHandlers: [],
            addEventListener: function (type, listener, useCapture) {
                this.eventHandlers.push([type, listener, useCapture]);
                this.ws.addEventListener(type, listener, useCapture);
            },
            send: function (data) {
                this.ws.send(data);
            },
            close: function () {
                this.ws.close();
            },
            set onopen(fn) {
                this._onopen = fn;
                if (this.ws) this.ws.onopen = this._onopen;
            },
            set onmessage(fn) {
                this._onmessage = fn;
                if (this.ws) this.ws.onmessage = this._onmessage;
            },
            set onerror(fn) {
                this._onerror = fn;
                if (this.ws) this.ws.onerror = this.wrappedErrorHandler;
            },
            wrappedErrorHandler: function (evt) {
                if (this.parent.attempts > this.parent.maxAttempts) {
                    this.parent._onerror && this.parent._onerror(evt);
                }
            },
            set onclose(fn) {
                this._onclose = fn;
                if (this.ws) this.ws.onclose = this.wrappedCloseHandler;
            },
            wrappedCloseHandler: function (evt) {
                if (this.parent.attempts > this.parent.maxAttempts) {
                    this.parent._onclose && this.parent._onclose(evt);
                    return;
                }

                this.parent.connect(this.parent.args);
            },
            connectedHandler: function () {
                var usingProxy = this.url.search("firebaseio.com") === -1;
                console.debug(
                    "[WebSocket] Firebase connection successful, " +
                        (usingProxy ? "using proxy." : "direct connection."),
                    this.ws
                );
                if (!usingProxy) {
                    // We made a direct connection, thus we should never attempt the proxy.
                    firebaseAvailable = true;
                }
            },
            timeoutHandler: function () {
                if (this.ws.readyState !== 0) return;
                console.debug(
                    "[WebSocket] Firebase connection is still pending after timeout. Attempting to open new connection."
                );
                this.resetWS(this.ws);
                this.ws.close();
                this.ws = null;
                this.connect(this.args);
            },
            resetWS: function (ws) {
                console.debug("[WebSocket] Resetting WebSocket");
                ws.onerror = null;
                ws.onclose = null;
                ws.onmessage = null;
                ws.onopen = null;
                for (handler in this.eventHandlers) {
                    ws.removeEventListener(handler[0], handler[1], handler[2]);
                }
            },
            connect: function (args) {
                var u = new URL(args[0]);
                this.attempts += 1;

                if (
                    forceFirebaseProxy ||
                    (this.attempts > this.maxAttempts && !firebaseAvailable)
                ) {
                    var parts = u.hostname.split(".");
                    u.searchParams.append("fb", parts[0]);
                    var ns = u.searchParams.get("ns");
                    if (!ns || ns === "") {
                        // Firebase connects in two ways, initially to <databaseName>.firebaseio.com which then returns a new
                        // connection URL, <firebaseNode>.firebaseio.com?ns=<databaseName>
                        // If no ns is set in the query params, we assume it's the initial connection and use the subdomain
                        // as the namespace.
                        ns = parts[0];
                    }
                    parts[0] = ns;
                    parts[1] = PROXY_ROOT;
                    u.hostname = parts.join(".");
                    args[0] = u.href;
                }

                // If a current WebSocket connection attempt exists, we remove all handlers from it so if something happens
                // on it later, it doesn't cause unusual problems for us.
                if (this.ws) this.resetWS(this.ws);

                // Store the most recent connection URL in local storage so the app can detect if we're using the proxy
                localStorage.setItem(CONNECTION_LS_KEY, args[0]);

                console.debug(
                    "[WebSocket] Attempting to connect...",
                    args[0],
                    new Date()
                );
                var ws = instantiate(WebSocket, args);
                ws.parent = this;

                // Ensure handlers get re-applied to the current WebSocket
                ws.onopen = this._onopen;
                ws.onmessage = this._onmessage;
                ws.onerror = this.wrappedErrorHandler;
                ws.onclose = this.wrappedCloseHandler;
                for (handler in this.eventHandlers) {
                    ws.addEventListener(handler[0], handler[1], handler[2]);
                }

                this.ws = ws;
                this.args = args;

                // This may not be effective for all properties, i.e. if they update
                this.binaryType = ws.binaryType;
                this.bufferedAmount = ws.bufferedAmount;
                this.extensions = ws.extensions;
                this.protocol = ws.protocol;
                this.readyState = ws.readyState;
                this.url = ws.url;

                // If the connection is still pending, we re-attempt it
                setTimeout(this.timeoutHandler.bind(this), FIREBASE_TIMEOUT);

                this.addEventListener("open", () => this.connectedHandler());
            },
        };

        fauxket.connect(args);
        return fauxket;
    }

    function CWebSocket() {
        console.debug("[WebSocket] Init websocket", arguments);

        // If it's not a firebaseio.com WebSocket, we just return the unaltered WebSocket
        if (arguments[0].search("firebaseio.com") === -1) {
            return instantiate(WebSocket, arguments);
        }

        return new Fauxket(arguments);
    }
})(WebSocket);
