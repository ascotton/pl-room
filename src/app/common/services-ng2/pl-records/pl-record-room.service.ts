import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import {
    PLGraphQLService,
    PLTimezoneService, PLHttpService, PLLodashService,
} from '@lib-components/index';
import { PLRecordParticipantsService } from './pl-record-participants.service';
import { PLAppointmentService } from './pl-appointment.service';
import { selectAuth } from '@root/src/app/modules/user/store';
import { AppState } from '@root/src/app/store';

@Injectable()
export class PLRecordRoomService {

    noteSchemas: any[] = null;
    billingCodes: any[] = null;

    clientsObserverForUser: any = {};

    private _updateEvent$ = new BehaviorSubject<any>({});
    private _clientAppointments$ = new BehaviorSubject<any>([]);

    constructor(
        private plAppointment: PLAppointmentService,
        private plTimezone: PLTimezoneService,
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plRecordParticipants: PLRecordParticipantsService,
        private plGraphQL: PLGraphQLService,
        private store: Store<AppState>,
    ) {

        this.store.select(selectAuth)
            .subscribe(({ isAuthenticated, user }) => {
                if (isAuthenticated) {
                    this.updateTodaysClients(user);
                }
            });
    }

    updateTodaysClients(user: any) {
        // Get start and end dates based on current user's timezone.
        const userTz = this.plTimezone.getUserZone(user);
        const todayDate = this.plTimezone.getUserToday(user);

        // Get all appointments for today.
        // Convert times to UTC for lookup.
        const queryParams = {
            provider: user.uuid,
            start: moment.tz(`${todayDate} 00:00:00`, 'YYYY-MM-DD HH:mm:ss', userTz)
            .utc().format('YYYY-MM-DDTHH:mm'),
            end: moment.tz(`${todayDate} 23:59:00`, 'YYYY-MM-DD HH:mm:ss', userTz)
            .utc().format('YYYY-MM-DDTHH:mm'),
            calendar_view: true,
        };

        this._updateEvent$.pipe(
            switchMap(() => {
                return new Observable((observer: any) => {
                    this.plHttp.get('appointments', queryParams).subscribe(
                        (res) => {
                            const appointments = this.formatAppointments(res.results, user);
                            this.getClientsFromAppointments(appointments, user.uuid).subscribe(
                                (clients) => {
                                    observer.next({ clients });
                                },
                                (err) => {
                                    observer.error(err);
                                },
                            );
                        },
                        (err) => {
                            observer.error(err);
                        },
                    );
                });
            }),
        ).subscribe((clients) => {
            this._clientAppointments$.next(clients);
        });
    }

    // trigger a fetch
    refreshClientAppointmentsData(params) {
        this._updateEvent$.next(params);
    }
    getClientAppointmentsData() {
        return this._clientAppointments$;
    }

    filterClientsByBillingCode(clients, billingCode) {
        return clients.filter(
            (client: any, idx) => {
                if (client.record && client.record.billing_code) {
                    return client.record.billing_code === billingCode;
                }
            });
    }

    formatAppointments(appointments, user) {
        return appointments.map((appointment) => {
            const timezone = user.xProvider && user.xProvider.timezone;
            const { apptStart, apptEnd } = this.plTimezone.computeAppointmentLocalDateTimes(appointment, timezone);
            appointment.start = apptStart.format(this.plTimezone.formatDateTime);
            appointment.end = apptEnd.format(this.plTimezone.formatDateTime);
            return appointment;
        });
    }

    getClientsFromAppointments(appointments, userUuid, clientFields1 = []) {
        return new Observable((observer: any) => {
            let clients = [];
            const observables = [];
            appointments.forEach((appointment, index) => {
                observables[index] = this.formAppointmentClients(appointment, userUuid, clientFields1)
                    // .pipe(first()).subscribe((resClients: any) => {
                    //     if (resClients && resClients.length) {
                    //         clients = clients.concat(resClients);
                    //     }
                    //     if (!observables[index]) {
                    //         console.log(index, observables)
                    //     }
                    //     observables[index].next();
                    // }, (err) => {
                    //     observables[index].error(err);
                    // });
            });
            if (!observables.length) {
                observer.next([]);
            } else if (observables.length == 1) {
                observables[0].subscribe((resClients: any) => {
                    clients = clients.concat(resClients);
                    observer.next(clients);
                }, (err) => {
                    observer.error(err);
                });
            } else {
                // forkJoin not working??
                combineLatest(observables)
                    .subscribe((resultsClients: any[]) => {
                        resultsClients.forEach((resClients: any[]) => {
                            clients = clients.concat(resClients);
                        });
                        observer.next(clients);
                    }, (err) => {
                        observer.error(err);
                    });
            }
        });
    };

    formAppointmentClients(appointment1, userUuid, clientFields = []) {
        return new Observable((observer: any) => {
            if (!appointment1.clients || !appointment1.clients.length) {
                observer.next([]);
            } else {
                // First, pre-create appointment, if needed.
                this.preCreateAppointment(appointment1, userUuid)
                    .pipe(first()).subscribe((resAppt: any) => {
                        const event = resAppt.event;
                        const appointment = resAppt.appointment;
                        const clients = [];
                        let curClient;
                        let record;
                        let curParticipant;
                        const billingCode = appointment.billing_code ? appointment.billing_code :
                         (appointment.event && appointment.event.billing_code) ?
                         appointment.event.billing_code : null;
                        const observables = [];
                        appointment.clients.forEach((client, index) => {
                            observables[index] = this.getRecord(client, appointment, event, userUuid, billingCode, clientFields);
                        });
                        if (!observables.length) {
                            observer.next([]);
                        } else {
                            combineLatest(observables)
                                .subscribe((resultsClients: any[]) => {
                                    resultsClients.forEach((resClient: any) => {
                                        clients.push(resClient.client);
                                    });
                                    observer.next(clients);
                                }, (err) => {
                                    observer.error(err);
                                });
                        }
                    });
            }
        });
    }

    formAppointmentEvent(appointment) {
        return {
            uuid: appointment.event.uuid,
            // start: appointment.event.start || appointment.original_start || appointment.start,
            // end: appointment.event.end || appointment.original_end || appointment.end,
            original_start: this.plTimezone.fromTZFormat(appointment.original_start) || this.plTimezone.fromTZFormat(appointment.start),
            original_end: this.plTimezone.fromTZFormat(appointment.original_end) || this.plTimezone.fromTZFormat(appointment.end),
            start: appointment.original_start || appointment.start,
            end: appointment.original_end || appointment.end,
        };
    }

    // To avoid errors and to simplify things, ensure appointment (id) ALWAYS exists.
    preCreateAppointment(appointment, userId) {
        return new Observable((observer: any) => {
            const event = this.formAppointmentEvent(appointment);
            if (appointment.uuid) {
                observer.next({ appointment, event });
            } else {
                this.getAppointment(appointment.uuid, event, userId)
                    .pipe(first()).subscribe((resAppointmentId: string) => {
                        appointment.uuid = resAppointmentId;
                        observer.next({ appointment, event });
                    });
            }
        });
    }

    // Would like to pre-create records, BUT depending on billing code, some records require
    // a client service or location, so can NOT pre-create a record here.
    getRecord(client, appointment, event, userId, billingCode, clientFields1 = []) {
        const clientFields = (clientFields1 && clientFields1.length) ? clientFields1 : ['uuid', 'first_name', 'last_name'];

        return new Observable((observer: any) => {
            let curParticipant = {
                client_expanded: client,
                uuid: client.uuid,
                billing_code: billingCode,
            };
            let record = this.plRecordParticipants.findOrFormMatchingRecord(curParticipant, appointment.records);
            let curClient: any = this.plLodash.pick(client, clientFields);
            curClient.appointment = {
                ...appointment,
                uuid: appointment.uuid,
                event: event,
                title: appointment.title || 'TITLE',
                start: appointment.start,
                end: appointment.end,
            };
            // if (record.uuid) {
                curClient.record = this.formatRecord(record, appointment);
                observer.next({ client: curClient });
            // } else {
            //     this.saveRecord(record, client.uuid, appointment.uuid, curClient.appointment.event, userId)
            //         .pipe(first()).subscribe((resRecord: any) => {
            //             curClient.record = this.formatRecord(resRecord.record, appointment);
            //             observer.next({ client: curClient });
            //         });
            // }

        });
    }

    getAppointment(appointmentUuid, event, userUuid) {
        return new Observable((observer: any) => {
            if (appointmentUuid) {
                observer.next(appointmentUuid);
            } else {
                this.plAppointment.saveFromEvent(event, null, userUuid)
                    .pipe(first()).subscribe((appointment: any) => {
                        observer.next(appointment.uuid);
                    }, (err) => {
                        observer.error(err);
                    });
            }
        });
    }

    isClientServiceRequired(billingCodeId) {
        return new Observable((observer: any) => {
            this.getBillingCodes().pipe(first()).subscribe(() => {
                const index = this.plLodash.findIndex(this.billingCodes, 'uuid', billingCodeId);
                const billingInfo = (index > -1) ? this.billingCodes[index] : null;
                let required = false;
                if (billingInfo && billingInfo.services && billingInfo.services.length) {
                    required = true;
                }
                observer.next({ required });
            });
        });
    }

    isEvaluation(clientService) {
        return clientService.service.code.indexOf('eval') > -1 ? true : false;
    }

    isNotDirectService(clientService) {
        return clientService.service.code.indexOf('direct') > -1 ? false : true;
    }

    isEvalPA(clientService) {
        return clientService.service.code === 'eval_pa';
    }

    getBillingCodes() {
        return new Observable((observer: any) => {
            if (this.billingCodes) {
                observer.next();
            } else {
                this.plHttp.get('billingCodes', {})
                    .pipe(first()).subscribe((res: any) => {
                        this.billingCodes = res.results;
                        observer.next();
                    });
            }
        });
    }

    getNotesSchema() {
        return new Observable((observer: any) => {
            if (this.noteSchemas) {
                observer.next();
            } else {
                this.plHttp.get('notesSchemas')
                    .pipe(first()).subscribe((res: any) => {
                        this.noteSchemas = res.results;
                        observer.next();
                    });
            }
        });
    }

    getRecordNotesSchema(billingCodeId: string) {
        return new Observable((observer: any) => {
            this.getNotesSchema()
                .pipe(first()).subscribe(() => {
                    this.getBillingCodes()
                        .pipe(first()).subscribe(() => {
                            let index = this.plLodash.findIndex(this.billingCodes, 'uuid', billingCodeId);
                            const billingInfo = (index > -1) ? this.billingCodes[index] : null;
                            index = this.plLodash.findIndex(this.noteSchemas, 'uuid', billingInfo.record_note_type);
                            const noteSchema = (index > -1) ? this.noteSchemas[index] : null;
                            observer.next({ noteSchema });
                        }, (err) => {
                            observer.error(err);
                        });
                }, (err) => {
                    observer.error(err);
                });
        });
    }

    formatRecord(record, appointment) {
        record = this.plLodash.omit(record, ['client_expanded', '_participantUuid']);
        record = Object.assign({}, {
            appointment: appointment.uuid,
        }, record);
        if (record.notes) {
            record.notes = (typeof(record.notes) === 'string') ? JSON.parse(record.notes) : record.notes;
        }
        return record;
    }

    formatRecordForBackend(record: any) {
        // Handle signed.
        if (!record.signed_on) {
            record.signed = false;
            record.signed_on = null;
            record.signed_by = null;
        } else {
            record.signed = true;
        }
        if (record.notes && typeof(record.notes) !== 'string') {
            record.notes = JSON.stringify(record.notes);
        }
        // Backend will error if passed back but empty string.
        if (!record.client_service) {
            delete record.client_service;
        }
        return record;
    }

    saveRecord(record1, clientUuid, appointmentUuid, event, userId) {
        return new Observable((observer: any) => {
            // Create a copy since we alter the notes format from string to JSON and that can create issues.
            let record = Object.assign({}, record1);

            // If do not have appointment yet, create it.
            this.plAppointment.checkForExisting({ event: event.uuid,
                original_start: event.original_start, original_end: event.original_end }, userId)
                .pipe(first()).subscribe((res: any) => {
                    if (res && res.uuid) {
                        appointmentUuid = res.uuid;
                    }
                    this.getAppointment(appointmentUuid, event, userId)
                        .pipe(first()).subscribe((apptUuid) => {
                            if (!record.uuid) {
                                record.appointment = apptUuid;
                                record.provider = userId;
                                record.client = clientUuid;
                            }
                            record = this.formatRecordForBackend(record);
                            this.plHttp.save('records', record)
                                .pipe(first()).subscribe((resRecord) => {
                                    const recordFormatted = this.formatRecord(resRecord, { uuid: appointmentUuid });
                                    observer.next({ record: recordFormatted, appointmentUuid })
                                }, (err) => {
                                    observer.error(err);
                                });
                        }, (err) => {
                            observer.error(err);
                        });

                }, (err) => {
                    observer.error(err);
                });
        });
    }

    saveMetricsPoint(metrics, record, clientUuid, appointmentUuid, event, userId) {
        return new Observable((observer: any) => {
            const ret: any = {};
            if (!record.uuid) {
                this.saveRecord(record, clientUuid, appointmentUuid, event, userId)
                    .pipe(first()).subscribe((resRecord: any) => {
                        ret.record = resRecord.record;
                        ret.appointmentUuid = resRecord.appointment;
                        this.saveMetricsPointExistingRecord(metrics, resRecord.record.uuid, userId)
                            .pipe(first()).subscribe((resSave: any) => {
                                ret.metricPoint = resSave.metricPoint;
                                observer.next(ret);
                            }, (err) => {
                                observer.error(err);
                            });
                    }, (err) => {
                        observer.error(err);
                    });
            } else {
                this.saveMetricsPointExistingRecord(metrics, record.uuid, userId)
                    .pipe(first()).subscribe((resSave: any) => {
                        // Why is resSave undefined??
                        if (resSave) {
                            ret.metricPoint = resSave.metricPoint;
                        }
                        observer.next(ret);
                    }, (err) => {
                        observer.error(err);
                    });
            }
        });
    }

    saveMetricsPointExistingRecord(metrics1, recordUuid, userId) {
        return new Observable((observer: any) => {
            const vars: any = {
                correct: metrics1.correct,
                trials: metrics1.trials,
                metricId: metrics1.metricId,
                providerId: userId,
            };
            let mutation;
            if (metrics1.id) {
                vars.id = metrics1.id;
                mutation = `mutation MetricPoint(
                    $id: UUID!,
                    $providerId: UUID!,
                    $correct: Int,
                    $trials: Int,
                    $metricId: ID
                ) {
                    updateMetricPoint(
                        input: {
                            metricPoint: {
                                id: $id,
                                providerId: $providerId,
                                correct: $correct,
                                trials: $trials,
                                metricId: $metricId
                            }
                        }
                    ) {
                        errors {
                            code
                        }
                        status
                        metricPoint {
                            id
                        }
                    }
                }`;
            } else {
                vars.recordId = recordUuid;
                mutation = `mutation MetricPoint(
                    $recordId: UUID!,
                    $correct: Int!,
                    $trials: Int!
                    $metricId: ID,
                    $providerId: UUID!
                ) {
                    createMetricPoint(
                        input: {
                            metricPoint: {
                                recordId: $recordId,
                                correct: $correct,
                                trials: $trials,
                                metricId: $metricId,
                                providerId: $providerId
                            }
                        }
                    ) {
                        errors {
                            code
                        }
                        status
                        metricPoint {
                            id
                        }
                    }
                }`;
            }
            this.plGraphQL.mutate(mutation, vars, {}).subscribe((res: any) => {
                let metricPoint;
                if (res.createMetricPoint) {
                    metricPoint = res.createMetricPoint.metricPoint;
                } else if (res.updateMetricPoint) {
                    metricPoint = res.updateMetricPoint.metricPoint;
                }
                observer.next({ metricPoint });
            }, (err) => {
                observer.error(err);
            });
        });
    }

    getMetrics(clientServiceId: string, recordId: string, metrics: any) {
        return new Observable((observer: any) => {
            const vars = {
                recordId: recordId,
            };
            const query = `query MetricPoints(
                $recordId: UUID!,
            ) {
                goalMetricPoints(
                    recordId: $recordId
                ) {
                    totalCount
                    edges {
                        node {
                            id
                            correct
                            trials
                            percentage
                            metric {
                                id
                                name
                                goal {
                                    id
                                    description
                                }
                            }
                        }
                    }
                }
            }`;
            this.plGraphQL.query(query, vars, {}).subscribe((res: any) => {
                const points = res.goalMetricPoints;
                // May have points from deleted / old metrics, so go through metrics only and skip
                // any extra points.
                // If any metrics do not have points, add them.
                let index;
                const metricPoints = [];
                metrics.forEach((metric) => {
                    index = this.plLodash.findIndex(points, 'metric.id', metric.id);
                    let point1;
                    if (index > -1) {
                        point1 = points[index];
                    } else {
                        point1 = {
                            id: null,
                            trials: 0,
                            correct: 0,
                            metric: {
                                id: metric.id,
                                name: metric.name,
                                goal: metric.goal,
                            },
                            record: recordId,
                        };
                    }
                    metricPoints.push(point1);
                });
                observer.next({ metricPoints });
            });
        });
    }
}
