/**
 * Whiteboard text editor directive controller
 *
 * @param $scope
 * @param $attrs
 * @param $element
 * @constructor
 */
var WhiteboardTextEditorController = function($scope, whiteboardTextEditorModel) {

    $scope.whiteboardTextEditorModel = whiteboardTextEditorModel;

};

WhiteboardTextEditorController.$inject = ['$scope', 'whiteboardTextEditorModel'];
module.exports = WhiteboardTextEditorController;
