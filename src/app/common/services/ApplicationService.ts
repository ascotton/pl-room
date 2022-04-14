const APPLICATION_SERVICE_LOCAL_STORAGE_PREFIX = 'applicationConfig';
import * as _ from 'lodash';

export class ApplicationService {
    _localStorageService: any;
    _applicationDefaults: any;
    overriden: any;

    constructor(applicationDefaults, localStorageService, $window) {
        this._localStorageService = localStorageService;
        this._applicationDefaults = applicationDefaults;
        this.overriden = {};
        // Deep copy
        this._copyDefaultsToThis();
        const _envConfig = $window['_envFileConfig'];
        const _envKeys = Object.keys(applicationDefaults);
        _envKeys.forEach(key => {
          if (this[key] && _envConfig && _envConfig.apps && _envConfig.apps[key]) {
            this[key].url = _envConfig.apps[key].url;
            applicationDefaults[key].url = _envConfig.apps[key].url;
          }
        });
        if (_envConfig) {
            console.log('ng1 using _envConfig');
          const authUrl = this['auth'].url;
          this['auth'] = Object.assign(this['auth'], {
            changePassword: `${authUrl}/password/change`,
            hijackReleaseUrl: `${authUrl}/hijack/release-hijack/`,
            loginUrl: `${authUrl}/login/`,
            logoutUrl: `${authUrl}/logout/`,
            rightsUrl: `${authUrl}/api/v1/user/`,
            statusUrl: `${authUrl}/api/v1/status/`,
            clientTokenUrl: `${authUrl}/api/v2/users/generate_client_token/`,
            poop: `${authUrl}/poop/`
          });

          const apiUrl = this['apiWorkplace'].url;
          this['apiWorkplace'] = Object.assign(this['apiWorkplace'], {
            providersUrl: `${apiUrl}/api/v1/providers/`,
          });

          const apiWorkplace = _envConfig.apps && _envConfig.apps['apiWorkplace'];
          if (apiWorkplace) {
            if (!this['apiSchedule'] || this['apiSchedule'] === undefined) {
                this['apiSchedule'] = {};
            }
            if (!this['apiClient'] || this['apiClient'] === undefined) {
                this['apiClient'] = {};
            }
            this['apiSchedule'].url = apiWorkplace.url;
            this['apiClient'].url = apiWorkplace.url;
          }
        }

        // local storage overrides the default.
        _.each(this, (appConfig: any, app) => {
            _.each(appConfig, (value, key) => {
                const overriddenProp = this.getProperty(app, key);
                if (overriddenProp) {
                    this[app][key] = overriddenProp;
                    this._setOverriden(app, key);
                }
            });
        });
    }

    getProperty(app, property) {
        let result;
        try {
            result = this._localStorageService.get(`${APPLICATION_SERVICE_LOCAL_STORAGE_PREFIX}.${app}.${property}`);
        } catch (e) {
            console.debug('error reading property from localStorageService in ApplicationService: ', e);
        }
        return result;
    }

    setProperty(app, property, value) {
        if (this[app] && this[app][property]) {
            this[app][property] = value;
            this._localStorageService.set(`${APPLICATION_SERVICE_LOCAL_STORAGE_PREFIX}.${app}.${property}`, value);
            this._setOverriden(app, property);
        }
    }

    removeProperty(app, property) {
        this._localStorageService.remove(`${APPLICATION_SERVICE_LOCAL_STORAGE_PREFIX}.${app}.${property}`);
    }

    _setOverriden(app, property) {
        this.overriden[app] = this.overriden[app] || {};
        this.overriden[app][property] = true;
    }

    _copyDefaultsToThis() {
        const copyOfDefaults = JSON.parse(JSON.stringify(this._applicationDefaults));
        _.each(copyOfDefaults, (config, app) => {
            this[app] = config;
        });
        this.overriden = {};
    }

    resetToDefaults() {
        this._copyDefaultsToThis();
        // local storage overrides the default.
        _.each(this, (appConfig: any, app) => {
            _.each(appConfig, (value, key) => {
                this.removeProperty(app, key);
            });
        });
    }

}

import { commonServicesModule } from './common-services.module';
const plCoreApplicationService =
    commonServicesModule.service('applications', ['applicationDefaults', 'localStorageService', '$window', ApplicationService]);
