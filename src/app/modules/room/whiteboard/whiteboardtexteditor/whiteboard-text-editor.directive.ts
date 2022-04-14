import { delay } from 'lodash';

let WhiteboardTextEditorDirective;

/**
 *  Directive for the whiteboard text editor widget
 *
 * @param $log
 * @param $compile
 * @param whiteboardModel
 * @param whiteboardTextEditorModel
 * @returns {{restrict: string, templateNamespace: string, replace: boolean, templateUrl: string, link: Function}}
 * @constructor
 */
WhiteboardTextEditorDirective = function($log, $compile, whiteboardModel, whiteboardTextEditorModel, dispatcherService,
                                         remoteDispatcherService) {
    return {
        restrict: 'E',
        replace: true,
        template: require('./whiteboard-text-editor.directive.html'),
        link: (scope, element, attrs, controllers) => {

            $log.debug('[WhiteboardTextEditorDirective] link function()');
            const editorElement = $('#whiteboard-editable-text');

            /*******************************
             * Setup bindings
             *******************************/
            function handleEditorChange(event, data) {
                if (data !== null && scope.whiteboardModel.getMode() === 'textedit') {
                    updateEditorView(data);
                }
            }

            function updateEditorView(editor) {
                $log.debug('[WhiteboardTextEditorDirective] handleEditorChange()');
                if (editor.visible && whiteboardModel.whiteboard.selectedElements[0]) {
                    // apply editor changes
                    editorElement.css({
                        width: editor.width,
                        height: editor.height,
                        'line-height': 1, // NOTE: without a unit, line-height is a multiplier of font-size
                        left: editor.x,
                        top: editor.y,
                        'font-size': editor.fontSize,
                        color: editor.color,
                        'font-family': editor.fontFamily,
                    });
                    // add text content
                    editorElement.val(editor.content);
                    // focus input
                    delay((el) => {
                        el.focus();
                        el[0].setSelectionRange(el.val().length, el.val().length);
                    },      50, editorElement);
                    // add event handlers
                    addHandlers(editorElement);
                    // show input
                    $('.whiteboard-text-editor').show();
                } else {
                    $('.whiteboard-text-editor').hide();
                }
            }

            function handleTextEdit(event) {
                const shapeRef = scope.whiteboardModel.whiteboard.selectedElements[0];
                if (shapeRef) {
                    shapeRef.updateShapeProperty('message', event.target.value, true);
                    scope.$apply();
                }
            }

            function endEdit(event) {
                $log.debug('[WhiteboardTextEditorDirective] endEdit');
                removeHandlers(editorElement);

                // if the text is valid (non-empty), then save it and revert to shap editing
                // otherwise, delete the shape
                if (scope.validateTextContent(event.target.value)) {
                    handleTextEdit(event);
                    scope.whiteboardModel.updateModified();
                    scope.whiteboardSelectorModel.showSelector(true);
                    scope.whiteboardTextEditorModel.editShape();
                    const shapeRef = scope.whiteboardModel.whiteboard.selectedElements[0];
                    if (shapeRef) {
                        $(shapeRef.getSvgElement()).show();
                    }
                } else {
                    $log.debug('[WhiteboardTextEditorDirective] no text, deleteSelectedShapes');
                    scope.whiteboardModel.deleteSelectedShapes();
                }
                scope.whiteboardModel.setMode('normal');

                // when we start text editing, send a remote event saying so, so that hotkey bindings in remote frames
                // can be disabled if necessary. PL-741
                const textevent = remoteDispatcherService.createCustomEventObject('textedit', { editingText: false });
                $(document).trigger(textevent);

                $('.whiteboard-text-editor').hide();
                scope.$apply();
            }

            function handleTextBlur(event) {
                endEdit(event);
            }

            function handleKeyPress(event) {
                // if enter is pressed, end editing
                if (event.keyCode === 13) {
                    endEdit(event);
                }
            }

            scope.validateTextContent = function(text) {
                return text.trim() !== '';
            };

            function addHandlers(el) {
                el.on('blur', handleTextBlur);
                el.on('keypress', handleKeyPress);
            }

            function removeHandlers(el) {
                el.off('blur', handleTextBlur);
                el.off('keypress', handleKeyPress);
            }

            function setupBinding() {
                $log.debug('[WhiteboardTextEditorDirective] setting up watch binding');
                dispatcherService.addListener('whiteboardEditorChange', null, handleEditorChange, this);
            }
            setupBinding();
        },
    };
};

import { whiteboardModule } from '../whiteboard.module';

const whiteboardTextEditorDirective = whiteboardModule.directive(
    'whiteboardTextEditor',
    ['$log', '$compile', 'whiteboardModel', 'whiteboardTextEditorModel', 'dispatcherService',
        'remoteDispatcherService', WhiteboardTextEditorDirective]);
