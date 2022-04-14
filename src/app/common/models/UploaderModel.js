import { bind } from 'lodash';

var UploaderModel = function($log) {

    var defaults = {
        filesInProgress: []
    };
    this.uploader = defaults;

    var init = bind(function() {
        $log.debug("[UploaderModel] Creating UploaderModel");
    }, this);
    init();

};

UploaderModel.$inject = ['$log'];
module.exports = UploaderModel;
