import * as _ from 'lodash';

const UrlFilter = function($log, $sce, $sanitize) {
    return function (input) {
        if (input) {
            // tslint:disable-next-line:max-line-length
            const urlRegex = '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?';
            const url = new RegExp(urlRegex, 'i');

            let newInput = '';

            const msgArray = input.split(' ');

            _.each(msgArray, (word) => {
                if (url.test(word)) {
                    if (word.indexOf('http') < 0) {
                        word = '<a href=\'http://' + word + '\' target=\'_blank\'>' + word + '</a> ';
                    } else {
                        word = '<a href=\'' + word + '\' target=\'_blank\'>' + word + '</a> ';
                    }
                    word = $sce.trustAsUrl(word);
                }

                newInput += word + ' ';

            });
            try {
                newInput = $sanitize(newInput);
            } catch (e) {
                // bad parse
                $log.debug('[UrlFilter] bad input, rejected');
                newInput = '';
            }
            return newInput;
        }

    };
};

export default UrlFilter;

import { commonFiltersModule } from './common-filters.module';
commonFiltersModule.filter('urlfilter', ['$log', '$sce', '$sanitize', UrlFilter]);

