
module.exports = angular.module('room.whiteboard.texteditor', [])
    .controller('WhiteboardTextEditorController', require('./WhiteboardTextEditorController'))
    .directive('whiteboardTextEditor', require('./WhiteboardTextEditorDirective'))
;
