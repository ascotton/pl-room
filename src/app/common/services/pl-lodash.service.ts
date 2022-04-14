/**
Wrapper for lodash functions. Some are replaced.
Why? Because for some odd reason (maybe versioning conflicts?) lodash `findIndex` was not working.
Also can help with testing as it's Angular style, explicit dependency injection.
*/

import { pick, omit, snakeCase } from 'lodash';
import * as angular from 'angular';

function plLodash() {
    const plLodash: any = {};
    const _plLodash: any = {};

    plLodash.findIndex = (array1, key, value) => {
        for (let ii = 0; ii < array1.length; ii++) {
            if (_plLodash.dotNotationKeyValue(array1[ii], key) === value) {
                return ii;
            }
        }
        return -1;
    };

    _plLodash.dotNotationKeyValue = (obj, keysString) => {
        let val = obj;
        const keys = keysString.split('.');
        keys.forEach((key) => {
            val = val[key];
        });
        return val;
    };

    plLodash.pick = pick;

    plLodash.omit = omit;

    plLodash.snakeCase = snakeCase;

    plLodash.noKeys = (obj1) => {
        return (Object.keys(obj1).length === 0) ? true : false;
    };

    // Note: cannot use `omit` as the argument name otherwise the omit above gets improperly set.
    plLodash.equals = (obj1Raw, obj2Raw, omit1 = null) => {
        let obj1;
        let obj2;
        if (omit1 && omit1.length) {
            obj1 = plLodash.omit(obj1Raw, omit1);
            obj2 = plLodash.omit(obj2Raw, omit1);
        } else {
            obj1 = obj1Raw;
            obj2 = obj2Raw;
        }
        if (plLodash.noKeys(obj1) && plLodash.noKeys(obj2)) {
            return true;
        }
        return angular.equals(obj1, obj2);
        /*
        let key;
        for (key in obj1) {
            if (!obj2[key]) {
                return false;
            }
        }
        // Check both ways.
        for (key in obj2) {
            if (!obj1[key]) {
                return false;
            }
        }
        return true;
        */
    };

    return plLodash;
}

export default plLodash;

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('plLodash', [plLodash]);
