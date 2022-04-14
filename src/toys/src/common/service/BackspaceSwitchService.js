var BackspaceSwitchService = function($window) {

    var BACKSPACE = 8,
        VALID_INPUT_TYPES = ['TEXT','PASSWORD','FILE','EMAIL','SEARCH','DATE'];

    function isInActiveContentEditable(node) {
        while (node) {
            if (node.getAttribute &&
                node.getAttribute("contenteditable") &&
                node.getAttribute("contenteditable").toUpperCase() === "TRUE") {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    function isActiveFormItem(node) {
        var tagName = node.tagName.toUpperCase();
        var isInput = (tagName === "INPUT" && VALID_INPUT_TYPES.indexOf(node.type.toUpperCase()) >= 0);
        var isTextarea = tagName === "TEXTAREA";
        if (isInput || isTextarea) {
            var isDisabled = node.readOnly || node.disabled;
            return !isDisabled;
        } else if(isInActiveContentEditable(node)) {
            return true;
        }
        return false;
    }

    function disabler(event) {
        if (event.keyCode === BACKSPACE) {
            var node = event.srcElement || event.target;
            if(isActiveFormItem(node)) {
                return true;
            }
            event.preventDefault();
        }
    }

    this.disableBackspace = function() {
        $window.addEventListener('keydown', disabler);
    };

    this.enableBackspace = function() {
        $window.removeEventListener('keydown', disabler);
    };
};

BackspaceSwitchService.$inject = ['$window'];

module.exports = BackspaceSwitchService;