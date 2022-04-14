import { ToolBase } from './tool-base.service';
declare var $M;

class EllipseTool extends ToolBase {
    constructor($log, whiteboardModel) {
        super($log, whiteboardModel, {
            outline     : 'red',
            strokeWidth     : 5,
            color       : 'green',
            opacity         : 1,
            dasharray       : '',
            matrix          : $M([
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
            ]),
        });
        // shape definitions
        this.name = 'EllipseTool';
        this.tagName = 'ellipse-shape';
        this.properties = ['outline', 'strokeWidth', 'color', 'opacity', 'dasharray'];

        this.iconClass = 'ellipse';
        this.label = 'Circle';
        this.registerTool();
    }
}

import { toolsModule } from './tools.module';
toolsModule.service('ellipseTool', EllipseTool);
