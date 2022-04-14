const Capitalize = function() {
    return function(input) {
        if (input) {
            return input.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    };
};
export default Capitalize;

import { commonFiltersModule } from './common-filters.module';
commonFiltersModule.filter('capitalize', Capitalize);
