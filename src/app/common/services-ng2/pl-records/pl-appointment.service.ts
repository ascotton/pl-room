import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { PLTimezoneService, PLHttpService } from '@lib-components/index';

@Injectable()
export class PLAppointmentService {

    constructor(private plTimezone: PLTimezoneService,
        private plHttp: PLHttpService,
    ) {}

    fillEventFields(event, fields = {}) {
        return Object.assign({}, {
            event: event.uuid,
            start: event.start,
            end: event.end,
            original_start: event.original_start || event.start,
            original_end: event.original_end || event.end,
        }, fields);
    }

    appointmentFromEvent(start, end, eventUuid, original_start, original_end) {
        const eventFill = {
            start,
            end,
            original_start,
            original_end,
            uuid: eventUuid,
        };
        return this.fillEventFields(eventFill);
    }

    saveFromEvent(event, appointmentFields = {}, userUuid) {
        const appointment = this.fillEventFields(event, appointmentFields);
        return this.save(appointment, userUuid);
    }

    checkForExisting(appointment, userUuid) {
        return new Observable((observer: any) => {
            let existingAppointment = null;
            const queryParams = {
                event: appointment.event,
                original_start: this.plTimezone.toUTCNoSeconds(appointment.original_start),
                original_end: this.plTimezone.toUTCNoSeconds(appointment.original_end),
                persisted_only: true,
                provider: userUuid,
            };
            this.plHttp.get('appointments', queryParams)
                .pipe(first()).subscribe((res: any) => {
                    if (res && res.results && res.results.length) {
                        // Should only be one, but in case of duplicates take the first one.
                        existingAppointment = res.results[0];
                    }
                    observer.next(existingAppointment);
                }, (err) => {
                    observer.error(err);
                });
        });
    }

    formatForBackend(appointment1) {
        const appointment = Object.assign({}, appointment1);
        const timeFields = ['start', 'end', 'original_start', 'original_end'];
        timeFields.forEach((field) => {
            if (appointment[field]) {
                appointment[field] = this.plTimezone.toUTC(appointment[field]);
            }
        });
        return appointment;
    }

    save(appointment1, userUuid) {
        return new Observable((observer: any) => {
            const appointment = this.formatForBackend(appointment1);

            const thisObj = this;
            const saveLocal = function(appointmentLocal) {
                thisObj.saveActual(appointmentLocal)
                    .pipe(first()).subscribe((resAppt) => {
                        observer.next(resAppt);
                    }, (err) => {
                        observer.error(err);
                    });
            }

            // If new, need to check for existing appointment first (in case of stale data).
            if (!appointment.uuid && appointment.event && appointment.original_start && appointment.original_end) {
                this.checkForExisting(appointment, userUuid)
                    .pipe(first()).subscribe((resExistingAppt: any) => {
                        if (resExistingAppt && resExistingAppt.uuid) {
                            appointment.uuid = resExistingAppt.uuid;
                        }
                        saveLocal(appointment);
                    }, (err) => {
                        observer.error(err);
                    });
            } else {
                saveLocal(appointment);
            }
        });
    }

    saveActual(appointment) {
        return new Observable((observer: any) => {
            this.plHttp.save('appointments', appointment)
                .pipe(first()).subscribe((res) => {
                    observer.next(res);
                }, (err) => {
                    observer.error(err);
                });
        });
    }

    delete(appointmentUuid) {
        return new Observable((observer: any) => {
            this.plHttp.delete('appointments', { uuid: appointmentUuid })
                .pipe(first()).subscribe(() => {
                    observer.next();
                }, (err) => {
                    observer.error(err);
                });
        });
    }
}