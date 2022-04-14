import { plSetupModule } from './pl-setup.module';

const techCheckState = {
    parent: 'app',
    name: 'setup',
    url: '/pl/setup',
    component: 'plSetup',
};

plSetupModule.config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state(techCheckState);
}]);
