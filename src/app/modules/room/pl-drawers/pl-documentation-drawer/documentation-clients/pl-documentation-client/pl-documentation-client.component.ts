import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import {
    PLApiLocationsService,
    PLGraphQLService,
    PLHttpService,
    PLLodashService,
    PLUrlsService,
} from '@root/index';

import { PLRecordRoomService } from '@common/services-ng2/pl-records';
import { PLRoomDocumentationService } from '../pl-room-documentation.service';

@Component({
    selector: 'pl-documentation-client',
    templateUrl: './pl-documentation-client.component.html',
    styleUrls: ['./pl-documentation-client.component.less'],
})
export class PLDocumentationClientComponent implements OnInit, OnChanges {
    @Input() client: any = {};
    @Input() provider: any = {};
    @Input() instanceId = '';

    urls: any = {};
    loading = true;
    loadingGoals = false;
    clientServices: any[] = [];
    clientServiceRequired = true;
    selectOptsClientServices: any[] = [];
    selectedClientServiceId = '';
    selectedClientService: any = {};

    billingCodes: any = [];
    billingCodesOpts: any[] = [];
    selectedBillingCode = '';
    selectedTrackingType = '';
    recordLocation: any = {};

    iepGoals: any[] = [];
    iepServiceAreas: any[] = [];
    metrics: any[] = [];

    isNotDirectService: boolean = false;
    viewMode = '';
    classesMode = {
        notes: '',
        metrics: '',
    };
    noteSchema: any = {};
    recordReady = false;
    haveNewMetrics: number = 0;
    isSavingNotes = false;
    isSavingRecord = false;
    isRecordSignOff = false;
    isEditingNotes = false;
    isSignoffExpanded = false;

    // One per client appointment, so will set later once have instance id.
    localStorageKey = '';
    localStorageData: any = {};

    constructor(
        private plGraphQL: PLGraphQLService,
        private plLodash: PLLodashService,
        private plRecordRoom: PLRecordRoomService,
        private plUrls: PLUrlsService,
        private docService: PLRoomDocumentationService,
        private plHttp: PLHttpService,
        private locationService: PLApiLocationsService,
    ) {}

    ngOnInit() {
        this.urls = this.plUrls.urls;
    }

    ngOnChanges(changes: any) {
        if (this.client && this.client.uuid && this.provider.uuid && this.instanceId) {
            // Note, can not use just client id, as could have multiple of same client (different appointments).
            this.localStorageKey = `documentationClient${this.instanceId}`;
            this.getClientServices();
            this.getBillingCodes();
            this.getLocationDetails();

            this.isRecordSignOff = this.client.record.signed;
            this.selectedBillingCode = this.client.record.billing_code;
            // Load ALL for the client once, then will pick the appropriate goals from cache
            // once the client service is selected.
            this.getIepAndInfo();
        }
    }

    refreshMetrics() {
        this.getIepAndInfo();
    }

    onMetricsUpdated() {
        // Change to a different, positive (truthy) value.
        this.haveNewMetrics = (this.haveNewMetrics === 1) ? 2 : 1;
    }

    onNotesSaving(event: any) {
        this.isSavingNotes = event;
    }

    onNotesEditing(event: any) {
        this.isEditingNotes = event;
    }

    getNotesSchema() {
        this.loading = true;
        this.noteSchema = {};
        this.plRecordRoom.getRecordNotesSchema(this.client.record.billing_code)
            .pipe(first()).subscribe((res: any) => {
                this.noteSchema = res.noteSchema;
                if (!this.client.record.note_schema) {
                    this.client.record.note_schema = res.noteSchema.uuid;
                    this.client.record.notes = {
                        subjective: '',
                        objective: '',
                        assessment: '',
                        plan: '',
                        notes: '',
                    };
                }
                // Evaluations do not have metrics.
                const clientServiceIndex = this.plLodash.findIndex(
                    this.clientServices, 'id', this.selectedClientServiceId,
                );
                if (clientServiceIndex > -1) {
                    this.selectedClientService = this.clientServices[clientServiceIndex];
                    this.isNotDirectService = this.plRecordRoom.isNotDirectService(this.selectedClientService);
                    const isEvalPAService = this.plRecordRoom.isEvalPA(this.selectedClientService);
                    if (this.isNotDirectService) {
                        this.toggleNotesMetrics('notes');
                    }
                    // PA Evaluations have a different note schema('general' schema) than other evaluations
                    if (isEvalPAService) {
                        const generalNoteSchema = this.plRecordRoom.noteSchemas
                            .find(schema => schema.code === 'general');
                        this.client.record.note_schema = generalNoteSchema.uuid;
                        this.noteSchema = generalNoteSchema;
                    }
                    this.getIepGoals(true);
                }
                this.updateLocalStorage();
                this.loading = false;
            });
    }

    getLocationDetails() {
        if (this.client.record && this.client.record.uuid) {
            this.locationService.get({ uuid: this.client.record.location })
                .subscribe((res: any) => {
                    this.recordLocation = res && res.length ? res[0] : {};
                    if (this.recordLocation &&
                        this.recordLocation.record_tracking_type
                    ) {
                        if (!this.client.record.tracking_type) {
                            this.selectedTrackingType = 'regular';
                            this.selectTrackingType();
                        } else {
                            this.selectedTrackingType = this.client.record.tracking_type;
                        }
                    }
                });
        }
    }

    getBillingCodes() {
        this.loading = true;
        this.billingCodes = [];
        this.billingCodesOpts = [];
        this.plHttp.get('billingCodes', {
            with_can_provide: 1,
            limit: 1000,
        }).subscribe((res: any) => {
            this.billingCodes = res.results;
            this.billingCodesOpts = this.getBillingCodesOpts();
            this.loading = false;
        });
    }

    getClientServices() {
        this.loading = true;
        // Reset.
        this.selectedClientServiceId = '';
        this.selectedClientService = {};
        const vars = {
            first: 100,
            clientId: this.client.uuid,
            compatibleWithProviderId: this.provider.uuid,
            billingCodeId: this.client.record.billing_code,
            status_In: 'not_started,in_process,idle',
        };
        const query = `query ClientServices(
            $first: Int!,
            $clientId: ID,
            $compatibleWithProviderId: String,
            $billingCodeId: UUID,
            $status_In: String,
        ) {
            clientServices(
                first: $first,
                clientId: $clientId,
                compatibleWithProviderId: $compatibleWithProviderId,
                billingCodeId: $billingCodeId,
                status_In: $status_In
            ) {
                totalCount
                edges {
                    node {
                        ... on DirectService {
                            id
                            service {
                                id
                                code
                                productType {
                                    id
                                    code
                                    name
                                }
                                serviceType {
                                    id
                                    code
                                    shortName
                                    longName
                                }
                            }
                            startDate
                            endDate
                        }
                        ... on Evaluation {
                            id
                            service {
                                id
                                code
                                productType {
                                    id
                                    code
                                    name
                                }
                                serviceType {
                                    id
                                    code
                                    shortName
                                    longName
                                }
                            }
                        }
                        ... on ClientService {
                            id
                        }
                    }
                }
            }
        }`;
        this.plGraphQL.query(query, vars, {}).subscribe((res: any) => {
            // Default.
            let viewMode = 'notes';

            this.clientServices = res.clientServices;
            this.selectOptsClientServices = this.formSelectOptsClientServices(this.clientServices);
            // Some billing codes may not need a client service, so check first.
            this.plRecordRoom.isClientServiceRequired(this.client.record.billing_code)
                .pipe(first()).subscribe((resRequired: any) => {
                    this.clientServiceRequired = resRequired.required;
                    if (!this.clientServiceRequired) {
                        this.selectClientService();
                        viewMode = 'notes';
                        this.toggleNotesMetrics(viewMode);
                    }
                });

            // Load state from local storage and pre-select if necessary.
            let data: any;
            try {
                data = localStorage.getItem(this.localStorageKey);
            } catch (e) {
                console.debug('localStorage error in PLDocumentationClientComponent'); 
            }
            if (data) {
                data = JSON.parse(data);
                if (data.viewMode) {
                    viewMode = data.viewMode;
                }
            }
            if (this.client.record.client_service) {
                this.selectedClientServiceId = this.client.record.client_service;
                this.selectClientService();
            } else {
                // If only 1 to select, just auto select it.
                if (this.selectOptsClientServices.length === 1) {
                    this.selectedClientServiceId = this.selectOptsClientServices[0].value;
                    this.selectClientService();
                } else {
                    if (data && data.selectedClientServiceId) {
                        this.selectedClientServiceId = data.selectedClientServiceId;
                        this.selectClientService();
                    }
                }
            }
            this.toggleNotesMetrics(viewMode);
            this.loading = false;
        });
    }

    selectClientService() {
        this.loading = true;
        // Reset.
        this.isNotDirectService = false;
        this.iepGoals = [];
        this.preCreateRecord()
            .pipe(first()).subscribe(() => {
                this.getNotesSchema();
            });
    }

    selectBillingCode(event: any) {
        const record: any = {
            ...this.client.record,
            billing_code: event.model,
            client_service: null,
        };
        this.noteSchema = {};
        this.saveRoomRecord(record, () => {
            // onError Rollback to previous billing code
            this.selectedBillingCode = this.client.record.billing_code;
        });
    }

    selectTrackingType() {
        const record: any = {
            ...this.client.record,
            tracking_type: this.selectedTrackingType,
        };
        this.saveRoomRecord(record);
    }

    saveRoomRecord(record: any, onError?: Function) {
        this.isSavingRecord = true;
        this.plRecordRoom.saveRecord(
            record,
            this.client.uuid,
            record.appointment,
            this.client.appointment.event,
            this.provider.uuid,
        )
            .pipe(first()).subscribe(
                (resRecord: any) => {
                    this.client.record = Object.assign(this.client.record, resRecord.record);
                    this.isRecordSignOff = this.client.record.signed;
                    this.selectedBillingCode = this.client.record.billing_code;
                    this.selectedClientServiceId = this.client.record.client_service;
                    this.selectedTrackingType = this.client.record.tracking_type || 'regular';
                    this.isSavingRecord = false;
                    this.getClientServices();
                },
                (err: any) => onError && onError(),
        );
    }

    updateLocalStorage() {
        if (this.localStorageKey) {
            this.localStorageData.selectedClientServiceId = this.selectedClientServiceId;
            this.localStorageData.viewMode = this.viewMode;
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.localStorageData));
        }
    }

    preCreateRecord() {
        return new Observable((observer: any) => {
            if (!this.client.record.uuid || this.selectedClientServiceId !== this.client.record.client_service ||
                this.selectedBillingCode !== this.client.record.billing_code) {
                const record: any = Object.assign(this.client.record, {
                    billing_code: this.selectedBillingCode,
                    client_service: this.selectedClientServiceId,
                    tracking_type: this.client.record.tracking_type || 'regular',
                });
                this.plRecordRoom.saveRecord(record, this.client.uuid, record.appointment,
                                             this.client.appointment.event, this.provider.uuid)
                    .pipe(first()).subscribe((resRecord: any) => {
                        this.client.record = Object.assign(this.client.record, resRecord.record);
                        observer.next();
                    });
            } else {
                observer.next();
            }
        });
    }

    formSelectOptsClientServices(clientServices1, skipEnded = true, skipEvals = false) {
        const clientServices: any = this.filterClientServices(clientServices1, skipEnded, skipEvals);
        return clientServices.map((clientService: any) => {
            return { value: clientService.id, label: this.formSelectLabelClientService(clientService) };
        });
    }

    formSelectLabelClientService(clientService: any) {
        const start = clientService.startDate ? moment(clientService.startDate).format('MM/YYYY') : '';
        const end = clientService.endDate ? moment(clientService.endDate).format('MM/YYYY') : '';
        const time = (start && end) ? `${start} - ${end}` : (start) ? `${start} - no end date` : '';
        const label = `${clientService.service.serviceType.shortName} ${clientService.service.productType.name}`;
        return `${label} ${time}`;
    }

    filterClientServices(clientServices: any[], skipEnded = true, skipEvals = true) {
        const nowTime = moment();
        return clientServices.filter((clientService: any) => {
            if (skipEvals && !clientService.startDate) {
                return false;
            }
            return (skipEnded && clientService.end_date && moment(clientService.end_date) < nowTime)
             ? false : true;
        });
    }

    toggleNotesMetrics(mode: string) {
        this.viewMode = mode;
        this.updateLocalStorage();
        for (const key in this.classesMode) {
            if (key === mode) {
                this.classesMode[key] = 'selected';
            } else {
                this.classesMode[key] = '';
            }
        }
    }

    getIepAndInfo() {
        this.iepServiceAreas = [];
        this.loadingGoals = true;
        const vars = {
            clientId: this.client.uuid,
        };
        const query = `query ClientIEPs(
            $clientId: UUID!,
        ) {
            clientIeps(
                clientId: $clientId
            ) {
                totalCount
                edges {
                    node {
                        id
                        status
                        startDate
                        serviceAreas {
                            edges {
                                node {
                                    serviceType {
                                        id
                                        code
                                    }
                                    goals {
                                        edges {
                                            node {
                                                id
                                                description
                                                metrics {
                                                    edges {
                                                        node {
                                                            id
                                                            name
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }`;
        this.plGraphQL.query(query, vars, {}).subscribe((res: any) => {
            // Get active iep.
            for (let ii = 0; ii < res.clientIeps.length; ii++) {
                if (res.clientIeps[ii].status === 'ACTIVE') {
                    this.iepServiceAreas = res.clientIeps[ii].serviceAreas;
                    this.getIepGoals(true);
                    break;
                }
            }
            this.loadingGoals = false;
        });
    }

    combineMetrics(goals) {
        const metrics = [];
        goals.forEach((goal, indexGoal) => {
            goal.shortName = `G${(indexGoal + 1)}`;
            goal.metrics.forEach((metric) => {
                metrics.push(Object.assign(metric, {
                    goal: {
                        id: goal.id,
                        description: goal.description,
                        shortName: goal.shortName,
                    },
                }));
            });
        });
        this.metrics = metrics;
    }

    getGoalsByService() {
        if (this.selectedClientService && this.selectedClientService.id) {
            for (let ii = 0; ii < this.iepServiceAreas.length; ii++) {
                if (this.iepServiceAreas[ii].serviceType.id === 
                    this.selectedClientService.service.serviceType.id) {
                    this.iepGoals = this.iepServiceAreas[ii].goals;
                    break;
                }
            }
        }
    }

    getIepGoals(showNotesIfNoGoals=false) {
        this.getGoalsByService();
        this.combineMetrics(this.iepGoals);
        if (showNotesIfNoGoals && this.iepGoals.length < 1) {
            this.toggleNotesMetrics('notes');
        }
    }

    isLocationAppointment() {
        return this.client.appointment.type === 'location';
    }

    notesAreValid() {
        if (this.requiresSoapNotes() && this.hasSoapNotes()) {
            return false;
        }

        // General notes requirement exception for LeadClinicians
        const generalNotesCanBeEmpty = this.isUserLeadClinician()
            && this.isLeadBillingCategory(this.billingCodes.find(bc => bc.uuid === this.client.record.billing_code));

        if (!this.requiresSoapNotes() && !generalNotesCanBeEmpty && !this.client.record.notes.notes) {
            return false;
        }

        return true;
    }

    requiresSoapNotes() {
        if (this.isLocationAppointment()) {
            return false;
        }
        return this.noteSchema && this.noteSchema.code === 'soap';
    }

    hasSoapNotes() {
        const S = this.client.record.notes.subjective;
        const O = this.client.record.notes.objective;
        const A = this.client.record.notes.assessment;
        const P = this.client.record.notes.plan;
        return !(S && S.trim().length)
            && !(O && O.trim().length)
            && !(A && A.trim().length)
            && !(P && P.trim().length);
    }

    isUserLeadClinician() {
        return this.provider.groups.includes('LeadClinician');
    }

    isLeadBillingCategory(bc: any) {
        return bc.event_creation_category === 'Meetings';
    }

    getSignoffError() {
        const errors: string[] = [];
        let signoffErrorMessage = '';

        // perform error checks
        if (this.clientServices && this.clientServices.length && !this.selectedClientServiceId) {
            errors.push('Client Service');
        }
        if (this.isLocationTrackingRequired() && !this.selectedTrackingType) {
            errors.push('Location tracking type');
        }
        if (this.requiresSoapNotes() && this.hasSoapNotes()) {
            errors.push('At least one S/O/A/P note');
        }

        // General notes requirement exception for LeadClinicians
        const generalNotesCanBeEmpty = this.isUserLeadClinician()
            && this.isLeadBillingCategory(this.billingCodes.find(bc => bc.uuid === this.client.record.billing_code));

        if (!this.requiresSoapNotes() && !generalNotesCanBeEmpty && !this.client.record.notes.notes) {
            errors.push('General notes');
        }

        if (errors.length <= 0) {
            return '';
        }
        if (errors.length === 1) {
            signoffErrorMessage = errors[0] + ' is required.';
        } else {
            errors.forEach((e: any, i: any) => {
                if (i === errors.length - 1) {
                    signoffErrorMessage += 'and ' + e;
                } else {
                    signoffErrorMessage += e + ', ';
                }
            });
            signoffErrorMessage += ' are required.';
        }
        return signoffErrorMessage;
    }

    signOffAndSave() {
        if (!this.getSignoffError()) {
            const record: any = {
                ...this.client.record,
            };

            if (this.isRecordSignOff && !record.signed) {
                record.signed = true;
                record.signed_by = this.provider.uuid;
                record.signed_on = new Date().toISOString();
            } else if (record.signed) {
                record.signed = false;
                record.signed_by = null;
                record.signed_on = null;
            }
            this.saveRoomRecord(record);
        }
    }

    isDisabledSignoff() {
        const recordSignedOff = this.client.record.signed;
        return recordSignedOff;
    }

    isDisabledSave() {
        return this.client.record && !this.client.record.signed && !this.isRecordSignOff || !this.notesAreValid();
    }

    isEditable() {
        return this.client.record && !this.client.record.signed;
    }

    getClientServiceCode(uuid: string): string {
        const clientServiceCode = this.clientServices.find(code => code.uuid === uuid);
        return clientServiceCode && clientServiceCode.code;
    }

    getBillingCode(uuid: string): string {
        const billingCode = this.billingCodes.find(code => code.uuid === uuid);
        return billingCode && billingCode.code;
    }

    getRoomBillingCodeList(): any[] {
        return this.billingCodes
            .filter(code => this.docService.roomSignOffBillingCodes.includes(code.code));
    }

    getBillingCodesOpts(): any[] {
        const opts = this.getRoomBillingCodeList()
            .map(billingCode => ({ value: billingCode.uuid, label: billingCode.name }));
        return this.plLodash.sort2d(opts, 'label');
    }

    getLocationTrackingOpts() {
        return this.docService.locationTrackingOpts;
    }

    hasClientService() {
        return this.client.record.client_service || !this.clientServiceRequired;
    }

    isDocumentationSignoffAllowed() {
        const selectedBillingCode = this.billingCodes.find(bc => bc.uuid === this.selectedBillingCode);
        return (selectedBillingCode &&
            this.docService.roomSignOffBillingCodes.includes(selectedBillingCode.code));
    }

    shouldShowBillingCode() {
        return (
            this.billingCodesOpts.length > 1 &&
            this.isDocumentationSignoffAllowed() &&
            (this.selectOptsClientServices.length || !this.clientServiceRequired)
        );
    }

    shouldShowMetrics() {
        const selectedBillingCode = this.billingCodes.find(bc => bc.uuid === this.selectedBillingCode);
        return (
            this.clientServiceRequired
            && !this.isNotDirectService
            && selectedBillingCode
            && !this.docService.noMetricsBillingCodes.includes(selectedBillingCode.code)
        );
    }

    isLocationTrackingRequired() {
        const billingCode = this.getBillingCode(this.client.record.billing_code);
        const serviceCode = this.getClientServiceCode(this.client.record.client_service);
        const BC = this.docService.docConsts.billingCode;
        const SC = this.docService.docConsts.serviceCode;

        const isDirectServiceOrMakeup =
            (billingCode === 'direct_services') ||
            (billingCode === 'direct_makeup');

        const isEligibleBillingCodeAndServiceCode =

            // DIRECT SERVICES
            (
                (
                    billingCode === BC.CONSULTATION ||
                    billingCode === BC.STUDENT_ABSENCE_LT_24_HR ||
                    billingCode === BC.STUDENT_ABSENCE_NO_NOTICE
                )
                &&
                (
                    serviceCode === SC.SLT_SERVICES_DIRECT ||
                    serviceCode === SC.OT_SERVICES_DIRECT ||
                    serviceCode === SC.BMH_SERVICES_DIRECT
                )
            ) ||

            // CONSULTATION
            (
                (
                    billingCode === BC.CONSULTATION ||
                    billingCode === BC.STUDENT_ABSENCE_LT_24_HR ||
                    billingCode === BC.STUDENT_ABSENCE_NO_NOTICE
                )
                &&
                (
                    serviceCode === SC.SLT_CONSULTATION ||
                    serviceCode === SC.OT_CONSULTATION ||
                    serviceCode === SC.BMH_CONSULTATION
                )
            ) ||

            // SUPERVISION
            (
                (
                    billingCode === BC.SL_OT_SUPERVISION_DIRECT ||
                    billingCode === BC.SL_OT_SUPERVISION_INDIRECT_BY_CLIENT ||
                    billingCode === BC.STUDENT_ABSENCE_LT_24_HR ||
                    billingCode === BC.STUDENT_ABSENCE_NO_NOTICE
                )
                &&
                (
                    serviceCode === SC.SLT_SUPERVISION ||
                    serviceCode === SC.OT_SUPERVISION
                )
            );

        const hasLocationTracking = this.recordLocation && this.recordLocation.record_tracking_type;

        return hasLocationTracking && (isDirectServiceOrMakeup || isEligibleBillingCodeAndServiceCode);
    }

    toggleSignoffExpanded() {
        this.isSignoffExpanded = !this.isSignoffExpanded;
    }
}
