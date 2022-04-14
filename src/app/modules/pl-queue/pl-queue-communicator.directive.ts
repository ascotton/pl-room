class PLQueueCommunicatorController {
    queueCtrl: any;

    constructor () {
    }

    initializeQueueCtrl(queueCtrl) {
        this.queueCtrl = queueCtrl;
    }

    get initialized() {
        if (this.queueCtrl) {
            return this.queueCtrl.initialized;
        }

        return false;
    }

    get activeActivity() {
        return this.queueCtrl.activeActivity;
    }

    set activeActivity(value) {
        this.queueCtrl.activeActivity = value;
    }

    isQueued(value) {
        if (this.queueCtrl) {
            return this.queueCtrl.isQueued(value);
        }

        return false;
    }

    addToActiveQueue(value) {
        this.queueCtrl.addToActiveQueue(value);
    }

    removeFromActiveQueue(value) {
        this.queueCtrl.removeFromActiveQueue(value);
    }

    toggle(value) {
        this.queueCtrl.toggle(value);
    }
}

const PLQueueCommunicatorDirective = function (): ng.IDirective {
    return {
        scope: true,
        restrict: 'A',
        controller: PLQueueCommunicatorController,
        controllerAs: 'plQueueCommunicator',
        link: function link(scope, element, attributes, controller) {
        }
    };
};

import { PLQueueModule } from './pl-queue.module';

PLQueueModule.directive('plQueueCommunicator', [
    PLQueueCommunicatorDirective
]);
