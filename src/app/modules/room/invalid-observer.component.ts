import { roomModule } from './room.module';

/**
 * Controller for the invalid observer route
 */
class InvalidObserverController {
    static $inject = ['$log', '$state'];
    $log: any;
    $state: any;

    constructor($log, $state) {
        this.$log = $log;
        this.$state = $state;
    }
}

export default InvalidObserverController;

roomModule.component('invalidObserver', {
    template: require('./invalid-observer.component.html'),
    bindings: {
    },
    controller: InvalidObserverController,
});
