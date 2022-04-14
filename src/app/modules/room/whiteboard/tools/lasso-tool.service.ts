import { ToolBase } from './tool-base.service';

/**
 * Class used to create Lasso Shape
 * @param $log
 * @param toolBase
 * @constructor
 */
class LassoTool extends ToolBase {
    static $inject = ['$log', 'whiteboardModel'];

    constructor($log, whiteboardModel) {
        super($log, whiteboardModel, {
            outline:    'black',
            strokeWidth:    1,
            color:      'none',
            dasharray:      '',
            opacity:        0,
            fontFamily: 'Verdana',
            fontSize: 20,
        });

        // shape definitions
        this.name = 'LassoTool';
        this.tagName = 'lasso-shape';

        // toolbar settings
        this.iconClass = 'pointer';
        this.label = 'Pointer';
        
        this.registerTool();
    }
}

import { toolsModule } from './tools.module';
toolsModule.service('lassoTool', LassoTool);
