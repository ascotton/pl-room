import { ToolBase } from './tool-base.service';
declare var $M;

class RectTool extends ToolBase {
    static $inject = ['$log', 'whiteboardModel'];

    constructor($log, whiteboardModel) {
        super($log, whiteboardModel, {
            outline     : 'red',
            strokeWidth     : 5,
            color       : 'blue',
            opacity         : 1,
            dasharray       : '',
            matrix          : $M([
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
            ]),
        });

        // shape definition
        this.name = 'RectTool';
        this.tagName = 'rect-shape';
        this.properties = ['outline', 'strokeWidth', 'color', 'opacity', 'dasharray'];

        // toolbar settings
        this.iconClass = 'rect';
        this.label = 'Rectangle';
        this.registerTool();
    }
}

import { toolsModule } from './tools.module';
toolsModule.service('rectTool', RectTool);
