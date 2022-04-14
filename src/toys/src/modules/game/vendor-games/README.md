# Vendor Games

Vendor games are third party games. We partner with game providers to make them available in the Room.

Games run in a (non-sandboxed) iframe.

The vendors are considered Partners and entail a certain level of access to our realtime systems. For this reason, and to accommodate game specific criteria, each vendor game requires a certain amount of custom integration development.

# Service Provider Interface

PL exposes a Service Provider Interface (SPI) that provides the API available to the game to interact with our systems.

The interface is called `PLGameDbAPI` and is reachable in the iframe through the window object as `'PLGameDb'` via `window.parent['PLGameDb']`.

# Integration

# Adding a new game
