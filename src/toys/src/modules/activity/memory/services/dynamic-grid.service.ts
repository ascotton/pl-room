/**
 * @class DynamicGrid
 * @classdesc Generic dynamically calculated grid implementation
 *            for absolutely positioned cells.
 *            The grid is dynamic, because it will automatically
 *            construct a cell matrix of columns and rows with their
 *            positioning on a given board of width and height.
 *            Number of columns and rows and filled cells depends
 *            on a given length of an elements and is limited
 *            by a given number of maxRows and maxColumns. So
 *            starting from zero elements to the number of
 *            maxRows * maxColumns element it will construct
 *            a grid of a proper view and provide an access
 *            to its dimensions.
 *            The grid is centric, means that is will calculate
 *            board-centric positioning for cells.
 *
 * @author Mykhailo Stadnyk <mstadnyk@lohika.com>
 */
export class DynamicGrid {
    model: any;


    /**
     * Returns default values for internal grid properties
     *
     * @returns {{
     *  columns: number,
     *  rows: number,
     *  length: number,
     *  cells: Array
     * }}
     */
    static defaultModel() {
        return {
            columns: 0,
            rows: 0,
            length: 0,
            cells: []
        };
    }

    /**
     * Returns default options for dynamic grid
     *
     * @returns {{
     *  length: number,
     *  maxRows: number,
     *  maxCols: number,
     *  proportion: number,
     *  boardWidth: number,
     *  boardHeight: number,
     *  cellWidth: number,
     *  cellHeight: number,
     *  cellPaddingHorizontal: number,
     *  cellPaddingVertical: number,
     *  keepWidth: boolean,
     *  keepHeight: boolean
     * }}
     */
    static defaultOptions() {
        return {
            length: 0,
            maxRows: 4,
            maxCols: 6,
            proportion: 2,
            boardWidth: 1024,
            boardHeight: 768,
            cellWidth: 125,
            cellHeight: 147,
            cellPaddingHorizontal: 10,
            cellPaddingVertical: 10,
            keepWidth: false,
            keepHeight: false
        };
    }

    /**
     * @property {number} rows
     * @readonly
     */
    get rows() {
        return this.model.rows - 0;
    }
    set rows(rows) {
        throw new TypeError('Trying to change read-only property "rows"');
    }

    /**
     * @property {number} columns
     * @readonly
     */
    get columns() {
        return this.model.columns - 0;
    }
    set columns(columns) {
        throw new TypeError('Trying to change read-only property "columns"');
    }

    /**
     * @property {number} cellWidth
     */
    get cellWidth() {
        return (this.model.cells[0] || {}).width || 0;
    }
    set cellWidth(width) {
        throw new TypeError('Trying to change read-only property "columns"');
    }

    /**
     * @property {number} cellHeight
     */
    get cellHeight() {
        return (this.model.cells[0] || {}).height || 0;
    }
    set cellHeight(height) {
        throw new TypeError('Trying to change read-only property "columns"');
    }

    /**
     * Returns positions for non-empty cells only
     *
     * @property {Array} positions
     * @readonly
     */
    get positions() {
        return this.cells
            .map((cell) => cell.empty ? null : {
                top: cell.top,
                left: cell.left,
                width: cell.width,
                height: cell.height
            })
            .filter((pos) => pos);
    }
    set positions(positions) {
        throw new TypeError('Trying to change read-only property "positions"');
    }

    /**
     * @property {Array} cells
     * @readonly
     */
    get cells() {
        return this.model.cells;
    }
    set cells(cells) {
        throw new TypeError('Trying to change read-only property "cells"');
    }

    /**
     * @property {number} length
     */
    get length() {
        return this.model.length;
    }
    set length(len) {
        throw new TypeError('Trying to change read-only property "length"');
    }

    /**
     * @constructor
     *
     * @param {Object} options
     * @param {number} options.length
     * @param {number} options.maxRows
     * @param {number} options.maxColumns
     * @param {number} options.proportion
     * @param {number} options.boardWidth
     * @param {number} options.boardHeight
     * @param {number} options.boardPadding
     * @param {number} options.cellWidth
     * @param {number} options.cellHeight
     * @param {boolean} options.responsiveCell
     * @param {number} options.cellPaddingHorizontal
     * @param {number} options.cellPaddingVertical
     * @param {boolean} options.keepWidth
     * @param {boolean} options.keepHeight
     */
    constructor(options) {
        /**
         * @property {{
         *  columns: number,
         *  rows: number,
         *  length: number,
         *  cells: Array
         * }} model
         * @access private
         * @memberof DynamicGrid
         */
        this.model = DynamicGrid.defaultModel();

        this.update(options);
    }

    /**
     * Dynamically calculates and updates grid data due to a given set of new
     * options
     *
     * @param {Object} options
     * @param {number} options.length
     * @param {number} options.maxRows
     * @param {number} options.maxColumns
     * @param {number} options.proportion
     * @param {number} options.boardWidth
     * @param {number} options.boardHeight
     * @param {number} options.boardPadding
     * @param {number} options.cellWidth
     * @param {number} options.cellHeight
     * @param {boolean} options.responsiveCell
     * @param {number} options.cellPaddingHorizontal
     * @param {number} options.cellPaddingVertical
     * @param {boolean} options.keepWidth
     * @param {boolean} options.keepHeight
     * @returns {DynamicGrid}
     */
    update(options) {
        options = Object.assign(DynamicGrid.defaultOptions(), options || {});

        const lastLength = this.model.length;
        const lastWidth = this.cellWidth;
        const lastHeight = this.cellHeight;

        // reset values
        this.model = DynamicGrid.defaultModel();

        const maxRows = options.maxRows;
        const maxLength = options.maxColumns * maxRows;

        if (options.length > maxLength) {
            throw new RangeError('Given length is invalid (greater than max allowed)!');
        }

        let cols = options.length;
        const len = cols;
        let rows = 1;
        let tail = cols;
        let pad = 0;
        let cellWidth = options.cellWidth;
        let cellHeight = options.cellHeight;
        const horizontalPadding = options.cellPaddingHorizontal;
        const verticalPadding = options.cellPaddingVertical;
        const boardPadding = (options.boardPadding || 0);
        const boardWidth = options.boardWidth - boardPadding * 2;
        const boardHeight = options.boardHeight - boardPadding * 2;

        if (cols > 2) {
            while (cols / rows > options.proportion) {
                cols -= 2;

                while (cols * rows < len && rows < maxRows) {
                    rows++;
                }

                if (cols * rows < len) { // prefer width over height
                    cols += 2;
                    rows--;
                    break;
                }
            }
        }

        if (options.responsiveCell) {
            // calculate cell width and height dynamically
            // instead of using pre-configured values
            const cellRatio = cellWidth / cellHeight;
            let maxRatio;
            const noChanges = lastLength === options.length;

            if (options.keepWidth && noChanges) {
                cellWidth = lastWidth;
                cellHeight = Math.floor(cellWidth / cellRatio);
            } else if (options.keepHeight && noChanges) {
                cellHeight = lastHeight;
                cellWidth = Math.floor(cellHeight * cellRatio);
            } else {
                cellWidth = Math.floor((
                        boardWidth -
                        (cols - 1) * horizontalPadding
                    ) / cols);

                cellHeight = Math.floor((
                        boardHeight -
                        (rows - 1) * verticalPadding
                    ) / rows);

                maxRatio = cellWidth / cellHeight;

                if (maxRatio < cellRatio) {
                    cellHeight = Math.round(cellWidth / cellRatio);
                }  else if (maxRatio > cellRatio) {
                    cellWidth = Math.round(cellHeight * cellRatio);
                }
            }
        }

        // re-center coordinates
        const x = Math.round((
                boardWidth -
                cols * cellWidth -
                (cols - 1) * horizontalPadding
            ) / 2);

        const y = Math.round((
                boardHeight -
                rows * cellHeight -
                (rows - 1) * verticalPadding
            ) / 2);

        for (let i = 0; i < rows; i++) {
            if (tail >= cols) {
                tail -= cols;
            } else {
                pad = (cols - tail) / 2;
            }

            for (let j = 0; j < cols; j++) {
                this.model.cells.push({
                    row: i,
                    column: j,
                    empty: !((i < rows - 1) || j >= pad && j < cols - pad),
                    top: boardPadding + y + (cellHeight + verticalPadding) * i,
                    left: boardPadding + x + (cellWidth + horizontalPadding) * j,
                    width: cellWidth,
                    height: cellHeight
                });
            }
        }

        this.model.columns = cols;
        this.model.rows = rows;
        this.model.length = len;

        return this;
    }
}
