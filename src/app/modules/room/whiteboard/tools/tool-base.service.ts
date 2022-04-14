/**
 * Base class for tools
 * @param $log
 * @constructor
 */
export class ToolBase {
    static $inject = ['$log', 'whiteboardModel'];

    settings: any;
    defaults: any;
    name = 'Tool';
    tagName = '';
    properties = [];
    iconClass = 'pointer';
    label = 'pointer';
    whiteboardModel: any;

    constructor(private $log, whiteboardModel, defaults) {
        this.defaults = defaults;
        this.settings = Object.assign({}, this.defaults);
        this.whiteboardModel = whiteboardModel;
    }

    registerTool() {
        this.whiteboardModel.whiteboard.tools[this.name] = this;
    }

    getDefaultSettings() {
        if (!this.settings.matrix && this.defaults.matrix) {
            this.settings.matrix = Object.assign({}, this.defaults.matrix);
        }
        return this.settings;
    }

    setStartPosition(initialData, initialX, initialY) {
        // the default startposition is the same as the initial mouse clicks
        initialData.startX = initialX;
        initialData.startY = initialY;
        initialData.x = initialX;
        initialData.y = initialY;
        return initialData;
    }

    clean() {
        // subclasses should override to clean up anything they changed
    }
}
