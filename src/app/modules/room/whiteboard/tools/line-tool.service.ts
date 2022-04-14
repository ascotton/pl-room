import { ToolBase } from './tool-base.service';
declare var $M;

class LineTool extends ToolBase {
    static $inject = ['$log', 'whiteboardModel'];

    constructor($log, whiteboardModel) {
        super($log, whiteboardModel, {
            color           : 'red',
            outline   : 'transparent',
            strokeWidth     : 5,
            opacity         : 1,
            dasharray       : '',
            matrix          : $M([
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
            ]),
        });

        // shape definitions
        this.name = 'LineTool';
        this.tagName = 'line-shape';
        this.properties = ['color', 'strokeWidth', 'opacity', 'dasharray'];

        this.iconClass = 'line';
        this.label = 'Line';

        this.registerTool();
    }
}

import { toolsModule } from './tools.module';
toolsModule.service('lineTool', LineTool);
