import { each, keys, intersection } from 'lodash';

var WhiteboardToolbarController = function($log, $scope, whiteboardModel, lassoTool, pencilTool, rectTool, ellipseTool, lineTool, textTool, stampTool, webSafeFontsService) {

    $scope.whiteboardModel = whiteboardModel;
    $scope.tools = [lassoTool, pencilTool, rectTool, ellipseTool, lineTool, textTool, stampTool];

    $scope.linestyles = ['', '3,11', '5,11', '10,11'];

    $scope.fonts = webSafeFontsService;

    $scope.getIconClasses = function(tool) {
        var classes = [];
        classes.push(tool.iconClass);
        if(tool == whiteboardModel.whiteboard.selectedTool) {
            classes.push('selected');
        }
        return classes;
    };

    $scope.getActiveProperties = function() {
        var props = [];
        if( whiteboardModel.whiteboard.selectedTool.name == 'LassoTool' && whiteboardModel.whiteboard.selectedElements.length > 0){
            var propArrys = [];
            each(whiteboardModel.whiteboard.selectedElements, function(el) {
                var props = keys(el.getShapeVO());
                propArrys.push(props);

            });
            props = intersection.apply(_, propArrys);
        }else{
            if(whiteboardModel.whiteboard.selectedTool) {
                props = whiteboardModel.whiteboard.selectedTool.properties;
            }
        }
        return props;
    };

    //Init
    var init = function () {
        $log.debug("whiteboard toolbar controller");
    };
    init();
};

WhiteboardToolbarController.$inject = ['$log', '$scope', 'whiteboardModel', 'lassoTool', 'pencilTool', 'rectTool', 'ellipseTool', 'lineTool', 'textTool', 'stampTool', 'webSafeFontsService'];
module.exports = WhiteboardToolbarController;
