/**
 * Application service for managing domain objects and application level components.
 *
 * DEV NOTE: This service should not be injected into any models.
 *
 * @param $log
 * @param $state
 */
var ApplicationService =
    function($log, $rootScope, $location, $urlMatcherFactory,
             firebaseAppModel, textChatModel,
             roomnameModel, videoChatModel, whiteboardModel, sharedUserModel) {


    return
    this.startup = function() {
        $log.debug("[ApplicationService] startup...");
    };

    var initializeModels = function() {
        $log.debug('[ApplicationService] initializing firebase services.');
        sharedUserModel.updateUserConnection();
    };

    /**
     * Capture the route change to intercept the current roomname
     */

    var validateRouteChange = function(event) {
        initializeModels();
        this.clearRouteWatcher();
    };

    var init = function () {
        $log.debug("[ApplicationService] Creating application service");
        //add the listener and capture the handle to remove it
        this.clearRouteWatcher = $rootScope.$on('$locationChangeStart', validateRouteChange);
    };
    init();

};
ApplicationService.$inject = ['$log', '$rootScope', '$location', '$urlMatcherFactory',
    'firebaseAppModel', 'textChatModel', 'roomnameModel', 'videoChatModel',
    'whiteboardModel', 'sharedUserModel'];
module.exports = ApplicationService;
