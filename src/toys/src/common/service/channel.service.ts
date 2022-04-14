'use strict';

class Transaction {
    listener: any;
    delay: boolean;
    constructor(listener) {
        this.listener = listener;
        this.delay = false;
    }

    delayReturn(delay) {
        if (typeof delay === 'boolean') {
            this.delay = delay;
        }
        return this.delay;
    }

    complete(params) {
        if (this.listener) {
            this.listener(params);
        }
        return this;
    }
}

class MyChannel {
    em: {};

    constructor(options) {
        this.em = {};
        if (!options) {
            return this;
        }
        if (options.onReady) {
            options.onReady();
        }
    }

    static makeDataObj(message) {
        return {
            trans: new Transaction(message.success),
            params: message.params,
        };
    }

    call(message) {
        $(this.em).trigger('channel::' + message.method, MyChannel.makeDataObj(message));
    }

    bind(method, listener) {
        $(this.em).bind('channel::' + method, (event, data) => {
            const result = listener(data.trans, data.params);
            if (data.trans.delayReturn()) {
                return;
            }
            data.trans.complete(result);
        });
    }
}

function channelService() {
    this.build = function() {
        return new MyChannel(this.$rootScope);
    };
}
import * as angular from 'angular';

angular.module('toys').service('ChannelService', [
    channelService,
]);
