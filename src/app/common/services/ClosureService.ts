/**
 * Service for generate a guid
 *
 */
const ClosureService = function() {
    this.closureify = function (...args) {
        const fn = args.pop();

        return (...params) => fn(...[...args, ...params]);
    };
};

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('closureService', [ClosureService]);
