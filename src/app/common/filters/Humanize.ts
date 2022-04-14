/**
 * Convert a string to a human readable format.
 *
 * Examples:
 *
 * camelCaseFormat => camel case format
 * TitleCaseFormat => title case format
 * snake_case_format => snake case format
 */

const Humanize = function() {
    return function(input) {
        if (input && typeof input === 'string') {
            return input.replace(/([A-Z])/g, ' $1').replace(/(_)/g, ' ').toLowerCase().trim();
        }
    };
};
export default Humanize;

import { commonFiltersModule } from './common-filters.module';
commonFiltersModule.filter('humanize', Humanize);
