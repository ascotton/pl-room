import { plSetupModule } from './pl-setup.module';

class PLSetupController {
    static $inject = ['$location', 'plAppGlobal'];
    lang = 'en';
    resultId = null;
    code = '';
    salesforceid = null;

    constructor($location, plAppGlobal) {
        plAppGlobal.setIsTechCheck(true);
        const queryParams = $location.search();
        const lowerCaseQueryParams =
            Object.keys($location.search()).reduce((a, b) => {
                const lowerCaseKey = b.toLowerCase();
                a[lowerCaseKey] = queryParams[b];
                return a;
            },                                     { });
        this.resultId = lowerCaseQueryParams['resultid'];
        if (lowerCaseQueryParams['lang']) {
            this.lang = lowerCaseQueryParams['lang'];
        }
        if (lowerCaseQueryParams['code']) {
            this.code = lowerCaseQueryParams['code'];
        }
        if (lowerCaseQueryParams['salesforceid'] || lowerCaseQueryParams['salesforce_id']) {
            this.salesforceid = lowerCaseQueryParams['salesforceid'] || lowerCaseQueryParams['salesforce_id'];
        }
    }
}
export default PLSetupController;

plSetupModule.component('plSetup', {
    template: require('./pl-setup.component.html'),
    bindings: {},
    controller: PLSetupController,
});
