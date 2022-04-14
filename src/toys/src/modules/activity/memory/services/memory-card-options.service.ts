const MEMORY_CARDS_OPTIONS = {
    // it is safe to change whenever it's required, the only thing is that it do not influence the drawer icons
    // (will keep display pairs as icon)
    SIMILAR_LENGTH: 2,

    // this option and below one is not safe to increase
    // (as it will require css design changes for the deck if total number of cards will be higher max_cols*max_rows = 24)
    MAX_GRID_COLS: 6,
    MAX_GRID_ROWS: 4,
    GRID_PROPORTION: 2, // safe to change - will change behavior of dynamic grid
    BOARD_WIDTH: 1024, // safe to change this and below, but have to match canonical board with and height
    BOARD_HEIGHT: 768,
    BOARD_PADDING: 40, // safe to change
    TOOLBAR_WIDTH: 90, // safe to change
    DROP_MARGIN: 20, // safe to change
    CARD_WIDTH: 125, // not safe to change until it match css design of the card
    CARD_HEIGHT: 147, // the same as above
    DRAWER_WIDTH: 192, // the same as above
    HORIZONTAL_PADDING: 10, // safe to change until it will match overall board dims and cards design
    VERTICAL_PADDING: 10, // the same as above
    RESPONSIVE_CARDS: true, // safe to change
    SIMILAR_NAMES: { // safe to change whenever it is required
        1: 'singles',
        2: 'pairs',
        3: 'trips',
        4: 'quartets',
        5: 'quintets',
        6: 'sextets',
        7: 'septets',
        8: 'octets',
        9: 'nonets',
        10: 'decets'
    },
    MAX_FLIPS_VALUES: [2, 3, 4, 'Unlimited'],
    FLIPS_DELAY: 2000
};

angular.module('toys').constant('MEMORY_CARDS_OPTIONS', MEMORY_CARDS_OPTIONS);
