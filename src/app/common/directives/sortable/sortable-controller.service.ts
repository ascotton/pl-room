import * as angular from 'angular';
let SortableController;
SortableController = function ($timeout) {

    this.container = null;
    this.type = null;
    this.pointer = null;
    this.canceled = false;
    const paddingsByType = {
        horizontal: ['padding-bottom', 'padding-top'],
        vertical: ['padding-left', 'padding-right']
    };
    let timeoutCancel = null;

    let clearTimeoutAddDragEnter = (dontAddEvent) => {
        if (timeoutCancel) {
            $timeout.cancel(timeoutCancel);
            timeoutCancel = null;
        }
        if (dontAddEvent) {
            return;
        }
        this.container[0].addEventListener('dragenter', this.bodyDragEnter);
    };

    this.dragStart = (e) => {
        this.scrollTop = this.container.scrollTop();
        this.canceled = true;
        this.sourceNodeHidden = false;
        this.sourceNode = $(e.currentTarget);
        this.sourceIndex = this.sourceNode.index();
        this.targetNode = null;
        this.insertMode = null;

        //Fix dnd for firefox
        e.dataTransfer.setData('text', 'text');

        this.prevCss = {};

        if (this.sourceNode.is(':first-child')) {
            this.targetNode = this.sourceNode.next();
            this.insertMode = 'insertBefore'
        } else {
            this.targetNode = this.sourceNode.prev();
            this.insertMode = 'insertAfter';
        }
    };

    this.dragOver = (e) => {
        clearTimeoutAddDragEnter(true);
        if (!this.sourceNode) {
            this.insertSeparator(e);
            return;
        }

        // Hide (NOT detach) source node on drag
        if (this.hideSourceNode && !this.sourceNodeHidden) {
            this.sourceNodeHidden = true;
            this.sourceNode.hide();

        }

        // Exclude drag over source node
        if (e.currentTarget !== this.sourceNode.get(0)) {
            this.insertSeparator(e);
        }
    };

    this.insertSeparator = (e) => {
        // Get drop element bounding rect
        let rect = e.currentTarget.getBoundingClientRect();
        let target = $(e.currentTarget);
        let isAfter = true;
        this.targetNode = target;

        // Update horizontal insert pointer position
        if (this.type === 'horizontal') {
            isAfter = e.clientY >= (rect.bottom + rect.top) / 2;
        }
        // Update vertical insert pointer position
        if (this.type === 'vertical') {
            isAfter = (e.clientX >= (rect.left + rect.right) / 2);
        }
        this.insertMode = isAfter ? 'insertAfter' : 'insertBefore';
        this.updateInsertPointer(this.targetNode, this.insertMode);
    };

    this.dragEnd = (e) => {
        if (!this.scope.canceled) {
            e.preventDefault();
        }
        // undo the hide() in this.dragOver
        if (this.hideSourceNode && this.sourceNodeHidden) {
            this.sourceNodeHidden = false;
            this.sourceNode.show();

        }
        // Remove insertion pointer
        this.removeInsertPointer();
        // Get initial array reference
        let list = this.scope.sortableList;

        if (this.canceled && this.scope.canceled) {
            // Update source array
            this.sourceNode = null;
            var item = list.slice(this.sourceIndex, this.sourceIndex + 1)[0];
            this.scope.$parent.$eval(this.scope.canceled, {
                $item: item,
            });
            this.scope.workspaceDropCallback({
                $item: item,
            });
            clearTimeoutAddDragEnter(false);
            return;
        }

        if (this.container.children().length) {
            if (!this.scope.shouldUseAngular) {
                this.sourceNode[this.insertMode](this.targetNode);
            }
            this.sourceNode.show();
        } else {
            this.container.append(this.sourceNode);
        }

        // Scroll source node into view
        this.sourceNode.get(0).scrollIntoView();

        // Get target index
        if (this.scope.shouldUseAngular) {
            this.targetIndex = this.targetNode.index();
        } else {
            this.targetIndex = this.sourceNode.index();
        }

        this.sourceNode = null;

        // Update source array
        const firstItem = list[this.targetIndex];
        const secondItem = list.splice(this.sourceIndex, 1)[0];
        list.splice(this.targetIndex, 0, secondItem);

        // Trigger callback
        if (this.scrollTop) {
            this.container.scrollTop(this.scrollTop);
            this.scrollTop = 0;
        }
        if (this.scope.callback) {
            this.scope.callback({
                $list: list,
                $index: this.targetIndex,
                $firstItem: firstItem,
                $secondItem: secondItem
            });
        }
    };

    this.bodyDragDrop = (event) => {
        event.preventDefault();
        this.canceled = false;
        if (this.sourceNode) {
            return true;
        }
        if (this.scope.dropCallback) {
            let data = event.dataTransfer.getData("Text") || event.dataTransfer.getData("text/plain");
            try {
                let transferredObject = JSON.parse(data);
                this.scope.dropCallback({
                    $item: transferredObject,
                    $index: this.pointer ? this.pointer.index() : null
                });
            } catch (e) {}
        }
        clearTimeoutAddDragEnter(false);
        this.removeInsertPointer();
    };

    this.bodyDragLeave = (e) => {
        if (this.sourceNode || timeoutCancel) {
            return true;
        }
        timeoutCancel = $timeout(() => {
            this.removeInsertPointer();
            this.container[0].addEventListener('dragenter', this.bodyDragEnter);
            this.container[0].removeEventListener('dragleave', this.bodyDragLeave);
            timeoutCancel = null;
        }, 500, true);
    };

    this.bodyDragEnter = function (e) {
        e.preventDefault();
        if (this.sourceNode) {
            return;
        }
        e.dataTransfer.dropEffect = 'copy';
        let children = this.container.children();
        let lastChild = children[children.length - 1];
        if (!lastChild) {
            return;
        }
        this.targetNode = $(lastChild);
        this.targetMode = 'insertAfter';
        this.updateInsertPointer(this.targetNode, this.targetMode);
        this.container[0].addEventListener('dragleave', this.bodyDragLeave);
        this.container[0].removeEventListener('dragenter', this.bodyDragEnter);
    }.bind(this);

    this.getIntegerPadding = (target, paddingName) => parseInt(target.css(paddingName)) | 0;

    this.calcPadding = (target, type) => {
        let paddingArray = paddingsByType[type];
        if (!paddingArray) {
            return 0;
        }
        let sum = 0;
        paddingArray.forEach((item) => sum += this.getIntegerPadding(target, item));
        return sum;
    };

    this.updateInsertPointer = (target, insertMode) => {

        if (!this.pointer) {
            let stringNode = '<' + this.sortableInjectNodeTag + ' class="'+ this.sortableInjectNodeClass + ' '
                + this.type + '">'
                + '<div></div>'
                + '</' + this.sortableInjectNodeTag + '>';
            this.pointer = $(stringNode).appendTo(this.container);
            this.pointer.on('dragover', (e) => {
                if (timeoutCancel) {
                    $timeout.cancel(timeoutCancel);
                    timeoutCancel = null;
                }
                e.preventDefault();
            });
        }

        // Get target position
        let position = target.position();

        // Css holder
        let css = null;

        // Update horizontal insert pointer position
        if (this.type === 'horizontal') {

            let scrollTop = this.container.scrollTop();
            let positionTop = position.top + scrollTop;

            if (insertMode === 'insertAfter') {
                positionTop += target.height() + this.calcPadding(target, this.type);
            }

            css = {top: positionTop + 'px', width: target.outerWidth(true) + 'px'};
        }

        // Update vertical insert pointer position
        if (this.type === 'vertical') {

            let scrollLeft = this.container.scrollLeft();
            let positionLeft = position.left + scrollLeft;

            let scrollTop = this.container.scrollTop();
            let positionTop = position.top + scrollTop;

            if (insertMode === 'insertAfter') {
                positionLeft += target.width();
            }

            css = {left: positionLeft + 'px', top: positionTop + 'px', height: target.outerHeight(true) + 'px'};
        }

        // Prevent multiple/unnecessary DOM updates
        if (!angular.equals(this.prevCss, css)) {

            this.prevCss = css;

            // Prevent dropping into source position (only if source node isn't hidden)
            if (!this.strictMode || this.hideSourceNode ||
                !(this.targetNode.get(0) === this.sourceNode.get(0)) &&
                !(this.targetNode.get(0) === this.sourceNode.next().get(0) && insertMode === 'insertBefore') &&
                !(this.targetNode.get(0) === this.sourceNode.prev().get(0) && insertMode === 'insertAfter')
            ) {
                this.pointer[insertMode](this.targetNode);
                if (this.insertPointerPosition) {
                    this.pointer.css(css)
                }
            }
        }

    };

    this.removeInsertPointer = (target, position) => {

        // Remove insertion pointer
        if (this.pointer) {
            this.pointer.remove();
            this.pointer = null;
        }

    };
}

import { commonDirectivesModule } from '../common-directives.module';
commonDirectivesModule.controller('sortableController',[
    '$timeout',
    SortableController,
]);
