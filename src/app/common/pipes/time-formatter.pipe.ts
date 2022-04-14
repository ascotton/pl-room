import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'timeFormatter',
})

export class TimeFormatterPipe implements PipeTransform {
    transform(input: moment.MomentInput): string {
        // convert to local
        const localTime = moment.utc(input).toDate();
        // format local
        const localTimeFormatted = moment(localTime).format('h:mm A');
        return localTimeFormatted;
    }
}
