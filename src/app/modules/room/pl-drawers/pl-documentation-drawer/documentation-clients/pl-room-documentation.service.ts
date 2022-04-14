import { Injectable } from '@angular/core';
import { PLApiLocationsService } from '@root/index';

@Injectable()
export class PLRoomDocumentationService {
    roomSignOffBillingCodes: string[] = [
        'canceled_by_provider',
        'unplanned_school_closure',
        'canceled_holiday',
        'canceled_tech_issue',
        'direct_makeup',
        'direct_services',
        'unplanned_student_absence',
        'student_absence_no_notice',
        'canceled_24_notice',
    ];
    noMetricsBillingCodes: string[] = [
        'canceled_by_provider',
        'unplanned_school_closure',
        'unplanned_student_absence',
        'student_absence_no_notice',
        'canceled_holiday',
    ];
    locationTrackingOpts = [
        { value: 'regular', label: 'Regular' },
        { value: 'extended_school_year', label: 'Extended School Year' },
        { value: 'compensatory_time', label: 'Compensatory Time' },
    ];
    docConsts = {
        clientServiceStatus: {
            IDLE: 'IDLE',
            NOT_STARTED: 'NOT_STARTED',
            IN_PROCESS: 'IN_PROCESS',
            COMPLETED: 'COMPLETED',
            CANCELLED: 'CANCELLED',
        },
        clientServiceStatusDisplayValue: {
            IDLE: 'Idle',
            NOT_STARTED: 'Not Started',
            IN_PROCESS: 'In Process',
            COMPLETED: 'Completed',
            CANCELLED: 'Cancelled',
        },
        billingCode: {
            CONSULTATION: 'consultation',
            STUDENT_ABSENCE_LT_24_HR: 'unplanned_student_absence',
            STUDENT_ABSENCE_NO_NOTICE: 'student_absence_no_notice',

            SL_OT_SUPERVISION_DIRECT: 'cf_slpa_cota_sup_direct',
            SL_OT_SUPERVISION_INDIRECT_BY_CLIENT: 'cf_slpa_cota_sup_indirect',

            SL_SUPERVISION_INDIRECT_BY_LOCATION: 'supervisionIndirect',
        },
        serviceCode: {
            SLT_SUPERVISION: 'supervision_slt',
            OT_SUPERVISION: 'supervision_ot',

            BMH_CONSULTATION: 'consultation_bmh',
            BMH_SERVICES_DIRECT: 'direct_bmh',

            SLT_CONSULTATION: 'consultation_slt',
            SLT_SERVICES_DIRECT: 'direct_slt',

            OT_CONSULTATION: 'consultation_ot',
            OT_SERVICES_DIRECT: 'direct_ot',
        },
    };

    constructor() {}
}
