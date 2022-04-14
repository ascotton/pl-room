import { ToolBase } from './tool-base.service';
declare var $M;

class StampTool extends ToolBase {
    static $inject = ['$log', 'whiteboardModel', 'stampFactory'];
    cursor = {
        type: 'css',
        cursor: 'crosshair',
    };

    constructor($log, whiteboardModel, stampFactory) {
        super($log, whiteboardModel, {
            opacity         : 1,
            width           : 60,
            height          : 60,
            matrix          : $M([
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
            ]),
        });

        // shape definition
        this.name = 'StampTool';
        this.tagName = 'stamp-shape';
        this.properties = ['stamp', 'opacity'];

        const defaultStamp = stampFactory.objects[0];
        const defaultStampData = {
            png: defaultStamp.png,
            svg: defaultStamp.svg,
        };
        this.defaults.stamp = defaultStampData;

        this.iconClass = 'stamp';
        this.label = 'Stamp';
        this.registerTool();
    }

    /*************************
     * Overridden methods
     *************************/
    getDefaultSettings() {
        // we revert everything to the tool defaults except the stamp and opacity
        const settings = Object.assign({}, this.defaults);
        settings.stamp = this.settings.stamp;
        settings.opacity = this.settings.opacity;
        return settings;
    }

    setStartPosition(initialData, initialX, initialY) {
        // the stamp startposition is offset up and to the left by the width/height of the default shape
        const defaults = this.getDefaultSettings();
        initialData.startX = initialX - defaults.width;
        initialData.startY =  initialY - defaults.height;
        initialData.x = initialX - defaults.width;
        initialData.y = initialY - defaults.height;
        return initialData;
    }

    clean() {
        this.whiteboardModel.setContentCursor(null);
    }
}

import { toolsModule } from './tools.module';
const stampTool = toolsModule.service('stampTool', StampTool);
