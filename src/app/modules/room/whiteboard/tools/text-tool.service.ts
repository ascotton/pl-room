import { ToolBase } from './tool-base.service';
declare var $M;

class TextTool extends ToolBase {
    static $inject = ['$log', 'whiteboardModel'];

    constructor($log, whiteboardModel) {
        super($log, whiteboardModel, {
            message         : '',
            default         : '',
            color           : 'black',
            fontFamily      : 'Verdana',
            fontSize        : 35,
            angle           : 0,
            matrix:         $M([
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
            ]),
        });

        // shape definitions
        this.name = 'TextTool';
        this.tagName = 'text-shape';
        this.properties = ['fontSize', 'fontFamily', 'color'];

        // toolbar settings
        this.iconClass = 'text';
        this.label = 'Text';
        this.registerTool();
    }
}

import { toolsModule } from './tools.module';
toolsModule.service('textTool', TextTool);
