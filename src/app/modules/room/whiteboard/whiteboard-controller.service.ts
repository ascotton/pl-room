import * as _ from 'lodash';

/**
 * Controller for the Whiteboard screen.
 * @param $scope
 * @constructor
 */
const WhiteboardController = function(
    $scope, $log, hotkeys, whiteboardModel, whiteboardSelectorModel, whiteboardTextEditorModel, LassoTool,
    firebaseAppModel,
) {
    $scope.whiteboardModel = whiteboardModel;
    $scope.whiteboardSelectorModel = whiteboardSelectorModel;
    $scope.whiteboardTextEditorModel = whiteboardTextEditorModel;
    
    const init = function() {
        $log.debug('[WhiteboardController] init()');
        whiteboardModel.whiteboard.selectedTool = LassoTool;
    };
    init();
};

WhiteboardController.$inject = [
    '$scope', '$log', 'hotkeys', 'whiteboardModel', 'whiteboardSelectorModel', 'whiteboardTextEditorModel',
    'lassoTool', 'firebaseAppModel',
];

export default WhiteboardController;

import { whiteboardModule } from './whiteboard.module';

whiteboardModule.controller('whiteboardController', WhiteboardController);
