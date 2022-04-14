import * as angular from 'angular';

/**
 * Model that holds the roster state
 * @param $log
 */
class WhiteboardSelectorModel {

    static $inject = ['$log', 'iPadSupportService'];

    defaults = {
        angle: 0,
        x : 100,
        y: 100,
        width: 1,
        height: 1,

        handleSize: 10,
        dashSize: 5,

        visible: false,
        visibleControls: false,
        adjusting: false,
    };

    selector: any = this.defaults;

    /**
     * Invoked on startup, like a constructor.
     */
    constructor(private $log, iPadSupportService) {
        $log.debug('[WhiteboardModel] creating model');
        if (iPadSupportService.isIPad()) {
            this.selector.handleSize = 24;
        }
    }

    setSelector(selector) {
        angular.extend(this.selector, selector);
    }

    getSelector() {
        return this.selector;
    }

    showSelector(visible) {
        this.$log.debug('[WhiteboardSelectorModel] showSelector(): ' + visible);
        this.selector.visible = visible;
        this.selector.visibleControls = visible;
    }

}

import { whiteboardcommonModelsModule } from './whiteboard-models.module';
whiteboardcommonModelsModule.service('whiteboardSelectorModel', WhiteboardSelectorModel);
