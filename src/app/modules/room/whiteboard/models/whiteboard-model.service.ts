import { Store } from '@ngrx/store';
import { AppState } from '@root/src/app/store';
import * as _ from 'lodash';
import { selectClientClickMuted } from '../../app/store';

class WhiteboardModelService {

    static $inject = ['$log', '$timeout', 'whiteboardSelectorModel', 'currentUserModel', 'firebaseModel',
        'firebaseAppModel', 'languageMixins', 'sortedCollectionService', 'dispatcherService', 'ngrxStoreService'];

    defaults = {
        mode: 'normal',
        connected: false,
        creationStatus: 'ready',
        activeItem: null,
        activeItemId: null,
        activeToolbar: null,
        contentCursor: null,
        tools: {},
        selectedElements: [],
        localReferences: {},
        elements: [],
        selectedTool: null,
        shiftDown: false,
        clipboard: [],
        pasteOffset: {
            x: 10,
            y: 10,
        },
    };

    whiteboard: any = this.defaults;
    isMouseMuted = false;

    constructor(private $log, private $timeout, private whiteboardSelectorModel, private currentUserModel,
                private firebaseModel, private firebaseAppModel, private languageMixins,
                private sortedCollectionService, private dispatcherService, private ngrxStoreService: Store<AppState>) {
        $log.debug('[WhiteboardStateService] creating state');
        ngrxStoreService.select(selectClientClickMuted).subscribe((isMuted) => {
            this.isMouseMuted = isMuted;
        });
    }

    setSelectedTool(tool) {
        // let the current tool clean up if it needs to
        if (this.whiteboard.selectedTool) {
            this.whiteboard.selectedTool.clean();
        }
        this.whiteboard.selectedTool = tool;

        // Clear the selected elements if a tool was selected
        if (tool && tool.name === 'LassoTool') {
            this.whiteboard.activeToolbar = 'lasso';
        } else {
            this.whiteboard.selectedElements = [];
        }
        this.updateSelector(false);
        this.dispatcherService.dispatch('whiteboardToolChangeEvent', null, this.whiteboard.selectedTool);
    }

    setActiveToolbar(toolbarName) {
        this.whiteboard.activeToolbar = toolbarName;
    }

    setActiveItemId(id) {
        this.whiteboard.activeItemId = id;
    }

    getActiveItem() {
        if (this.whiteboard.activeItemId) {
            return this.getLocalReference(this.whiteboard.activeItemId);
        }
        return null;
    }

    selectedItemIsText = function() {
        const item = this.whiteboard.selectedElements[0];
        return item && item.element && item.element[0].tagName === 'text';
    }

    editSelectedTextShape = function() {
        this.dispatcherService.dispatch('whiteboardStartTextEdit', null, null);
    }

    setMode(mode) {
        this.$log.debug('[WhiteboardModel] setMode(): ' + mode);
        this.whiteboard.mode = mode;
    }

    getMode() {
        return this.whiteboard.mode;
    }

    /**
     * Set the custom cursor for the whiteboard pointer.
     * Options are:
     *    {type:'css', cursor:[standard css pointers e.g. crosshair, grab, etc]
     *    or:
     *    {type:'img', src: example.png}
     * @param cursor
     */
    setContentCursor(cursor) {
        this.whiteboard.contentCursor = cursor;
    }

    /**************************
     * geometric transformation methods
     **************************/
    moveSelectedShapes(dx, dy) {
        this.$log.debug(`[WhiteboardModel] moveSelectedShapes: ${dx}:${dy}`);
        _.forEach(this.whiteboard.selectedElements, (item) => {
            this.$log.debug(`[WhiteboardModel] translate: ${dx}:${dy}`);
            item.translate(dx, dy);
        });
    }

    scaleSelectedShapes(dWidth, dHeight, cx, cy) {
        _.forEach(this.whiteboard.selectedElements, (item) => {
            this.$log.debug(`[WhiteboardModel] scaleSelectedShapes: ${dWidth} : ${dHeight} cx: ${cx} cy: ${cy}`);
            item.scale(dWidth, dHeight, cx, cy);
        });
    }
    rotateSelectedShapes(angle, cx, cy) {
        _.forEach(this.whiteboard.selectedElements, (item) => {
            this.$log.debug('[WhiteboardModel] rotateSelectedShapes()');
            item.rotate(angle, cx, cy);
        });
    }

    /**************************
     * toolbar methods
     **************************/
    /**
     * update toolbar settings
     */
    // debouncedBulkUpdate = _.debounce(function(bulkVoList) {
    //     this.whiteboard.elements.bulkUpdate(bulkVoList);
    // }.bind(this), 200);

    setToolbarProperty(type, value, isolate) {
        this.$log.debug(`[WhiteboardModel] setToolbarProperty prop/value: ${type} : ${value}`);
        if (_.indexOf(this.whiteboard.selectedTool.properties, type) >= 0) {
            this.whiteboard.selectedTool.settings[type] = value;
        }

        // some tools don't propagate their toolbar settings to selected items (e.g. the stamp)
        if (!isolate) {
            let vo;
            this.whiteboard.selectedElements.forEach((item) => {
                item.updateShapeProperty(type, value, true);
                vo = item.getShapeVO();
                this.saveElement(vo);
            });
        }
    }

    /**************************
     * firebase methods
     **************************/
    /**
     * Setup the load and value handlers for the remote object
     */
    initialize() {
        const remoteObjectRef = this.firebaseModel.getFirebaseRef('whiteboard');
        const eventHandler = _.bind(this.collectionEventHandler, this);
        this.whiteboard.elements = this.sortedCollectionService.createCollection(remoteObjectRef, eventHandler);
    }

    /**
     * This handles all the events from the sorted collection and passes them to individual handlers
     * which converts to whiteboard events for the rest of the module.
     * @param type
     * @param id
     * @param data
     * @param previousChildId
     */
    collectionEventHandler(type, id, data, previousChildId) {
        this.$log.debug(`[WhiteboardModel] collection event: ${type} id: ${id}`);
        switch (type) {
                case 'value':
                    this.handleWhiteboardValue(id, data);
                    break;
                case 'child_added':
                    this.handleChildAdded(id, data);
                    break;
                case 'child_removed':
                    this.handleChildRemoved(id, data);
                    break;
                case 'child_changed':
                    this.handleChildChanged(id, data);
                    break;
                case 'child_moved':
                    this.handleChildMoved(id, data, previousChildId);
                    break;
                default:
                    this.$log.debug('[WhiteboardModel] collection event not handled: ' + type);
        }
    }

    handleWhiteboardValue(id, data) {
        if (data !== null) {
            const event: any = {};
            event.type = 'value';
            event.element = data;
            this.dispatcherService.dispatch('whiteboardChangeEvent', null, event);
        }
    }

    handleChildAdded(id, data) {
        const event: any = {};
        event.type = 'child_added';
        event.element = data;
        this.dispatcherService.dispatch('whiteboardChangeEvent', null, event);
    }

    handleChildRemoved(id, data) {
        const event: any = {};
        event.type = 'child_removed';
        event.element = data;
        this.dispatcherService.dispatch('whiteboardChangeEvent', null, event);
    }

    handleChildChanged(id, data) {
        const event: any = {};
        event.type = 'child_changed';
        event.element = data;
        event.localChange = this.isLocalChange(data);
        this.dispatcherService.dispatch('whiteboardChangeEvent', null, event);
    }

    handleChildMoved(id, data, prevChildId) {
        const event: any = {};
        event.type = 'child_moved';
        event.element = data;
        event.prevChildId = prevChildId;
        this.dispatcherService.dispatch('whiteboardChangeEvent', null, event);
    }

    handleWhiteboardError() {
        this.$log.debug('[WhiteboardModel] whiteboard firebase error.');
        // TODO handle fb errors
    }

    isLocalChange(data) {
        let local = false;
        const elementRef = this.getLocalReference(data.name);
        if (elementRef) {
            local = elementRef.isLocalModification(data.txnHash);
        }
        return local;
    }

    /***********************************************************************************
     * Persistence api
     **********************************************************************************/
    saveElement(vo) {
        this.whiteboard.elements.setWithPriority(vo.name, vo, vo.index);
        this.$log.debug('[WhiteboardModel] save element: ' + vo.name);
    }

    updateElement(vo) {
        this.resetPasteOffsets();

        this.$log.debug('[WhiteboardModel] data:' + JSON.stringify(vo));
        this.whiteboard.elements.update(vo.name, vo);
    }

    removeAllElements() {
        this.$log.debug('[WhiteboardModel] removing all elements');
        this.whiteboard.elements.removeAll();
    }

    removeElement(vo) {
        this.whiteboard.elements.remove(vo.name);
    }

    /***********************************************************************************
     * Element methods
     **********************************************************************************/
    updateModified() {
        _.forEach(this.whiteboard.selectedElements, _.bind(function(item) {
            if (item.isModified()) {
                this.$log.debug('[WhiteboardModel] updateModified()');
                this.updateElement(item.getShapeVO());
                item.setModified(false);
            }
        },                                                 this));
    }

    destroyElement(element) {
        const vo = element.getShapeVO();
        // reorder elements
        // this starts at the removed item index and
        // re-sorts from there to the end
        const index = vo.index;
        const elements = this.whiteboard.elements;
        for (let i = index; i < elements.length; i++) {
            const item = elements[i + 1];
            if (item) {
                this.$log.debug(`[WhiteboardModel] index: ${item.index} new index: ${i}`);
                item.index = i;
                this.saveElement(item);
            }
        }
        // remove element from firebase
        this.removeElement(vo);
        // remove element from the local app
        element.destroyElement();
    }

    getElementData(key) {
        const elementData = this.whiteboard.elements.getElement(key);
        return elementData;
    }

    getLocalReference(key) {
        return this.whiteboard.localReferences[key];
    }

    addLocalElement(element) {
        this.$log.debug('[WhiteboardModel] adding local element:' + element.getShapeVO().name);
        const vo = element.getShapeVO();
        this.whiteboard.localReferences[vo.name] = element;
    }

    removeLocalReference(element) {
        this.$log.debug('[WhiteboardModel] removing local element:' + element.getShapeVO().name);
        const vo = element.getShapeVO();
        delete this.whiteboard.localReferences[vo.name];
    }

    clearSelection() {
        this.resetPasteOffsets();

        this.whiteboard.selectedElements = [];
        this.updateSelector(false);
        this.dispatcherService.dispatch('whiteboardSelectionClear', null, null);
    }
    /*********************************
     * Multiple Selection
     **********************************/
    selectAll() {
        if (this.currentUserModel.user.isInGroup('Observer')
            || this.isMouseMuted && !this.currentUserModel.user.isClinicianOrExternalProvider()) {
            return;
        }
        this.setSelectedTool(this.whiteboard.tools.LassoTool);

        this.resetPasteOffsets();
        const shapeControllers = [];
        // go get all the controllers and add them to the selected shapes
        this.whiteboard.elements.forEach((element) => {
            const controller = this.getLocalReference(element.name);
            shapeControllers.push(controller);
        });
        this.selectShapes(shapeControllers);
    }

    selectShapes(shapes) {

        this.resetPasteOffsets();
        if (shapes === null) {
            this.whiteboard.selectedElements = [];
        } else if (this.whiteboard.shiftDown) {
            this.whiteboard.selectedElements = _.union(this.whiteboard.selectedElements, shapes);
        } else {
            this.whiteboard.selectedElements = shapes;
        }

        const props = this.calculateProps();
        _.each(props, (value, key) => {
            this.whiteboard.selectedTool.settings[key] = value;
        });

        this.updateSelector(false);
        this.dispatcherService.dispatch('whiteboardSelectionChange', null, null);
    }

    /*********************************
     * Selection
     **********************************/
    selectShape(shape) {
        this.resetPasteOffsets();
        this.$log.debug('[WhiteboardModel] selectShape() shape: ', shape);
        if (shape === null) {
            this.whiteboard.selectedElements = [];
        } else if (this.whiteboard.shiftDown) {
            this.whiteboard.selectedElements.push(shape);
        } else {
            this.whiteboard.selectedElements = [shape];
        }
        const props = this.calculateProps();
        _.each(props, (value, key) => {
            this.whiteboard.selectedTool.settings[key] = value;
        });

        this.dispatcherService.dispatch('whiteboardSelectionChange', null, null);
    }

    selectInitialShape(shape) {
        this.$log.debug('[WhiteboardModel] selectInitialShape()');
        this.whiteboard.selectedElements = [shape];

        const props = this.calculateProps();
        _.each(props, (value, key) => {
            this.whiteboard.selectedTool.settings[key] = value;
        });

        this.dispatcherService.dispatch('whiteboardInitialSelectionChange', null, null);
    }

    updateSelector(initial) {
        this.$log.debug('[WhiteboardModel] updateSelector()');
        if (this.whiteboard.selectedElements.length > 0) {
            let selectorParams;
            if (initial === true) {
                selectorParams = this.calculateNominalSelectorGeometry();
            } else {
                selectorParams = this.calculateSelectorGeometry();
            }
            this.$log.debug('[WhiteboardModel] selectorParams: ' + JSON.stringify(selectorParams));
            this.whiteboardSelectorModel.setSelector(selectorParams);
            const nonEmptySelector = () => {
                return selectorParams.width > 0 || selectorParams.height > 0;
            };
            if (this.isWhiteboardSelectable() && nonEmptySelector()) {
                this.whiteboardSelectorModel.showSelector(true);
            }
        } else {
            this.whiteboardSelectorModel.showSelector(false);
        }
        this.dispatcherService.dispatch('whiteboardSelectorUpdate', null, null);
    }

    deleteSelectedShapes() {
        const selected = this.whiteboard.selectedElements;
        const numSelected = selected.length;
        for (let i = 0; i < numSelected; i++) {
            const element = selected[i];
            this.$log.debug('[WhiteboardModel] deleting: ' + element);
            this.destroyElement(element);
        }
        this.selectShape(null);
    }

    isWhiteboardSelectable() {
        return this.whiteboard.selectedTool.name === 'LassoTool' && this.getMode() === 'normal';
    }

    /**
     * Calculate the set of toolbar properties common to all selected elements
     */
    private calculateProps() {
        const settings = {};
        const toolSettings = _.keys(this.whiteboard.selectedTool.settings);
        _.each(this.whiteboard.selectedElements, (element) => {
            const vo = element.getShapeVO();
            _.each(toolSettings, (prop) => {

                // use the setting of the element unless it conflicts with another element
                // then just set it to null
                if (_.has(settings, prop) && settings[prop] !== null) {
                    if (settings[prop] !== vo[prop]) {
                        settings[prop] = null;
                    }
                } else if (!_.has(settings, prop)) {
                    settings[prop] = vo[prop];
                }
            });
        });
        return settings;
    }

    calculateSelectorGeometry() {
        this.$log.debug('[WhiteboardModel] calculateSelectorGeometry');
        const selectedElements = this.whiteboard.selectedElements;
        const selectorParams: any = {};
        if (selectedElements.length > 0) {
            // find minimum x=
            selectorParams.x = _.minBy(selectedElements, (obj: any) => {
                return obj.getExtents().x;
            }).getExtents().x;
            // find minimum y
            selectorParams.y = _.minBy(selectedElements, (obj: any) => {
                return obj.getExtents().y;
            }).getExtents().y;

            const largestX2Obj: any = _.maxBy(selectedElements, (obj: any) => {
                const extents = obj.getExtents();
                return extents.x + extents.width;
            });
            const largestX2ObjExtents: any = largestX2Obj.getExtents();
            selectorParams.width = largestX2ObjExtents.x + largestX2ObjExtents.width - selectorParams.x;

            const largestY2Obj: any = _.maxBy(selectedElements, (obj) => {
                const extents = obj.getExtents();
                return extents.y + extents.height;
            });
            const largestY2ObjectExtents = largestY2Obj.getExtents();
            selectorParams.height = largestY2ObjectExtents.y + largestY2ObjectExtents.height - selectorParams.y;

            selectorParams.angle = 0;
        }
        this.$log.debug('[WhiteboardModel] selectorParams: ' + JSON.stringify(selectorParams));
        return selectorParams;
    }

    calculateNominalSelectorGeometry() {
        this.$log.debug('[WhiteboardModel] calculateNominalSelectorGeometry');
        const selectedElements = this.whiteboard.selectedElements;
        const selectorParams: any = {};
        // This special case should only have one selected element
        if (selectedElements.length === 1) {
            const selectedElement = selectedElements[0];
            const extents = selectedElement.getNominalExtents();
            selectorParams.x = extents.x;
            selectorParams.y = extents.y;
            selectorParams.width = extents.width;
            selectorParams.height = extents.height;
            selectorParams.angle = 0;
        }
        return selectorParams;
    }

    hasMultipleSelected() {
        return this.whiteboard.selectedElements.length > 1;
    }

    hasSelected() {
        return this.whiteboard.selectedElements.length > 0;
    }

    /***********************************************************************************
     * Z order api
     **********************************************************************************/
    moveSelectionForward() {
        this.$log.debug('[WhiteboardModel] move selection forward');
        const elements = this.whiteboard.elements;
        if (this.whiteboard.selectedElements.length === 1) {
            // get the selection
            const selectedElement = this.whiteboard.selectedElements[0];
            // check for the end...
            if (this.isSelectionOnTop()) {
                // we cant move past the end
                this.$log.debug('[WhiteboardModel] element cannnot move forward');
                return;
            }
            let vo = selectedElement.getShapeVO();
            const elementData = this.getElementData(vo.name);
            // this sets the txnHash internally
            selectedElement.setModified(true);
            vo = selectedElement.getShapeVO();
            // this matches it for this operation
            elementData.txnHash = vo.txnHash;
            const elementIndex = elementData.index;

            // get the target
            if (elementIndex < elements.length - 1) {
                const targetElement = elements[elementIndex + 1];
                const local = this.getLocalReference(targetElement.name);
                local.setModified(true);
                targetElement.txnHash = local.getShapeVO().txnHash;
                targetElement.index = elementIndex;
                elementData.index = elementIndex + 1;
                this.$log.debug('[WhiteboardModel] move selection forward: targetIndex: ' + targetElement.index);
                this.$log.debug('[WhiteboardModel] move selection forward: elementIndex: ' + elementData.index);
                this.saveElement(targetElement);
                this.saveElement(elementData);
            }
        } else {
            // multiple selection
            this.$log.debug('[WhiteboardModel] Cannot move multiple selections');
        }
    }

    moveSelectionBackward() {
        this.$log.debug('[WhiteboardModel] move selection forward');
        const elements = this.whiteboard.elements;
        if (this.whiteboard.selectedElements.length === 1) {
            // get the selected element data
            const selectedElement = this.whiteboard.selectedElements[0];
            // check for the beginning...
            if (this.isSelectionOnBottom()) {
                // we cant move back beyond the beginning
                this.$log.debug('[WhiteboardModel] element cannnot move backward');
                return;
            }
            let vo = selectedElement.getShapeVO();
            const elementData = this.getElementData(vo.name);
            // this sets the txnHash internally
            selectedElement.setModified(true);
            vo = selectedElement.getShapeVO();
            // this matches it for this operation
            elementData.txnHash = vo.txnHash;
            const elementIndex = elementData.index;

            // get the target
            if (elementIndex > 0) {
                const targetElement = elements[elementIndex - 1];
                const local = this.getLocalReference(targetElement.name);
                local.setModified(true);
                targetElement.txnHash = local.getShapeVO().txnHash;
                targetElement.index = elementIndex;
                elementData.index = elementIndex - 1;
                this.$log.debug('[WhiteboardModel] move selection forward: targetIndex: ' + targetElement.index);
                this.$log.debug('[WhiteboardModel] move selection forward: elementIndex: ' + elementData.index);
                this.saveElement(targetElement);
                this.saveElement(elementData);
            }
        } else {
            // multiple selection
            this.$log.debug('[WhiteboardModel] Cannot move multiple selections');
        }
    }

    private isSelectionAtIndex(index) {
        if (this.hasMultipleSelected()) {
            return false;
        }

        const selectedElement = this.whiteboard.selectedElements[0];
        const vo = selectedElement.getShapeVO();
        if (vo.index === index) {
            return true;
        }
        return false;

    }

    isSelectionOnTop() {
        let onTop = false;
        if (this.hasSelected()) {
            const elements = this.whiteboard.elements;
            onTop = this.isSelectionAtIndex(elements.length - 1);
        }
        return onTop;
    }

    isSelectionOnBottom() {
        let onBottom = false;
        if (this.hasSelected()) {
            const elements = this.whiteboard.elements;
            onBottom = this.isSelectionAtIndex(0);
        }
        return onBottom;
    }

    /***********************************************************************************
     * Misc functions
     **********************************************************************************/
    copySelection() {
        this.whiteboard.clipboard = [];
        this.whiteboard.selectedElements.forEach((item) => {
            const vo = item.getShapeVO();
            this.whiteboard.clipboard.push(vo);
        },                                       this);
    }

    resetPasteOffsets() {
        this.whiteboard.pasteOffset.x = 10;
        this.whiteboard.pasteOffset.y = 10;
    }

    pasteSelection() {
        this.whiteboard.clipboard.forEach((item) => {
            const newVO = _.cloneDeep(item);
            newVO.name = this.whiteboard.elements.generateId();
            newVO.index = this.getIndex(null);
            newVO.matrix.elements[0][2] += this.whiteboard.pasteOffset.x;
            newVO.matrix.elements[1][2] += this.whiteboard.pasteOffset.y;
            this.saveElement(newVO);
        },                                this);

        this.whiteboard.pasteOffset.x += 10;
        this.whiteboard.pasteOffset.y += 10;
    }

    /**
     * This will return the currently known index for the item or the end of the list for
     * items that don't exist yet.
     * @param key
     * @returns number
     */
    getIndex(key) {
        let index = this.whiteboard.elements.indexOf(key);
        if (index === -1) {
            index = this.whiteboard.elements.length;
        }
        return index;
    }
}

import { whiteboardcommonModelsModule } from './whiteboard-models.module';
whiteboardcommonModelsModule.service('whiteboardModel', WhiteboardModelService);
