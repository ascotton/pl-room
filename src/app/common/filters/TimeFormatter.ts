import * as moment from 'moment';

const TimeFormatter = function() {
   return function(input) {
       // convert to local
       const localTime = moment.utc(input).toDate();
       // format local
       const localTimeFormatted = moment(localTime).format('h:mm A');
       return localTimeFormatted;
   };
};
export default TimeFormatter;

import { commonFiltersModule } from './common-filters.module';
commonFiltersModule.filter('timeFormatter', TimeFormatter);
