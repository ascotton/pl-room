class PlConfirmController {
    confirmText: any;
    headerText: any;
    onCancel: any;
    onConfirm: any;

    constructor() {
        const defaultText = 'confirm';
        this.confirmText = this.confirmText
                                ? this.confirmText
                                : defaultText;

        this.headerText = this.headerText
                                ? this.headerText
                                : defaultText;
    }

    close() {
        if (this.onCancel) {
            this.onCancel();
        }
    }

    confirm() {
        if (this.onConfirm) {
            this.onConfirm();
        }
    }

}

export default PlConfirmController;

import angular from 'angular';

const plConfirm = angular.module('room.common.directives').component('plConfirm', {
    template: require('./pl-confirm.component.html'),
    bindings: {
        activated: '<',
        header: '<',
        bodyText: '<',
        confirmText: '<',
        onCancel: '<',
        onConfirm: '<',
    },
    controller: PlConfirmController,
});
