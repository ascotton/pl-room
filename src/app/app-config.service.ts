declare var _envFileConfig: any;

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { PLUrlsService, PLHttpErrorService, PLClientStudentDisplayService } from '@root/index';
import { environment } from '../environments/environment';
import { User } from './modules/user/user.model';
import { AppState } from './store';
import { selectCurrentUser } from './modules/user/store';

@Injectable()
export class AppConfigService {
    apps: any = environment.apps;

    showAppNav = true;
    currentUser: User;
    genericErrorMessage = 'Oops, something went wrong. Please try again. If the problem persists, please contact us for support.';

    constructor(
        private plUrls: PLUrlsService,
        private plHttpError: PLHttpErrorService,
        // private router: Router,
        store: Store<AppState>,
    ) {
        store.select(selectCurrentUser)
            .subscribe((user: any) => {
                this.currentUser = user;
                this.setErrorMessages();
            });
        this.checkForConfig();
        this.formUrls(this.apps);

        // this.router.events.subscribe((event) => {
        //     if (event instanceof NavigationStart) {
        //         this.showAppNav = true;
        //     }
        // });
    }

    checkForConfig() {
        if (typeof(_envFileConfig) !== 'undefined' && _envFileConfig.apps) {
            this.apps = Object.assign(this.apps, _envFileConfig.apps);
            console.log('Using envConfigFile, apps:', this.apps);
            this.formUrls(this.apps);
        }
    }

    formUrls(apps1: any = null) {
        let urls = {};
        if (!apps1) {
            apps1 = this.apps;
        }
        if (apps1) {
            let apps = ['auth', 'apiTechcheck', 'apiWorkplace', 'platform', 'techcheck', 'admin',
             'lightyear', 'toychest', 'hamm', 'rex', 'woody', 'eduClients', 'landing'];
            apps = apps.concat(['socket']);
            apps = apps.concat(['apollo']);
            const appUrls: any = {};
            apps.forEach((app: any) => {
                appUrls[app] = (apps1[app] && apps1[app].url) ? apps1[app].url : '';
            });
            urls = {
                socket: `${appUrls.socket}`,

                apollo: `${appUrls.apollo}`,

                assumeLogin: `${appUrls.auth}/hijack/email/`,
                login: `${appUrls.auth}/login/`,
                logout: `${appUrls.auth}/logout/`,
                releaseLogin: `${appUrls.auth}/hijack/release-hijack/`,
                status: `${appUrls.auth}/api/v1/status/`,
                clientTokenUrl: `${appUrls.auth}/api/v2/users/generate_client_token/`,

                activities: `${appUrls.apiWorkplace}/api/v1/activities/`,
                appointments: `${appUrls.apiWorkplace}/api/v3/appointments/`,
                assignments: `${appUrls.apiWorkplace}/api/v1/assignments/`,
                assignmentsAdd: `${appUrls.apiWorkplace}/api/v1/assignments/add/`,
                assignmentsRemove: `${appUrls.apiWorkplace}/api/v1/assignments/remove/`,
                areasOfConcern: `${appUrls.apiWorkplace}/api/v1/areas-of-concern/`,
                assessments: `${appUrls.apiWorkplace}/api/v1/assessments/`,
                availabilitySettings: `${appUrls.apiWorkplace}/api/v1/availability/preferences/`,
                billingCodes: `${appUrls.apiWorkplace}/api/v1/billing_codes/`,
                clients: `${appUrls.apiWorkplace}/api/v1/clients/`,
                clientServices: `${appUrls.apiWorkplace}/api/v2/client-services/`,
                contactTypes: `${appUrls.apiWorkplace}/api/v1/contact-types/`,
                contacts: `${appUrls.apiWorkplace}/api/v1/contacts/`,
                directServices: `${appUrls.apiWorkplace}/api/v1/direct-services/`,
                documentTypes: `${appUrls.apiWorkplace}/api/v1/document-types/`,
                documents: `${appUrls.apiWorkplace}/api/v1/documents/`,
                ethnicities: `${appUrls.apiWorkplace}/api/v1/ethnicities/`,
                evaluations: `${appUrls.apiWorkplace}/api/v3/evaluations/`,
                evaluationActivities: `${appUrls.apiWorkplace}/api/v3/evaluations/:evaluation_uuid/activities/`,
                events: `${appUrls.apiWorkplace}/api/v1/events/`,
                invoices: `${appUrls.apiWorkplace}/api/v1/invoices/`,
                invoicesPreview: `${appUrls.apiWorkplace}/api/v2/invoices/preview/`,
                jumbotron: `${appUrls.apiWorkplace}/api/v1/jumbotron/`,
                languages: `${appUrls.apiWorkplace}/api/v1/languages/`,
                locations: `${appUrls.apiWorkplace}/api/v1/locations/`,
                metrics: `${appUrls.apiWorkplace}/api/v1/metrics/`,
                metricsPoints: `${appUrls.apiWorkplace}/api/v1/metrics-points/`,
                noms: `${appUrls.apiWorkplace}/api/v1/noms/`,
                nomsEntry: `${appUrls.apiWorkplace}/api/v1/noms-entry/`,
                notesSchemas: `${appUrls.apiWorkplace}/api/v1/notes/schemas/`,
                notesExports: `${appUrls.apiWorkplace}/api/v1/notes/exports/`,
                notesExportsOrganizations: `${appUrls.apiWorkplace}/api/v1/notes/exports/organizations/`,
                organizations: `${appUrls.apiWorkplace}/api/v1/organizations/`,
                permissions: `${appUrls.auth}/api/v1/permissions/`,
                providerTypes: `${appUrls.apiWorkplace}/api/v1/provider-types/`,
                providers: `${appUrls.apiWorkplace}/api/v1/providers/`,
                races: `${appUrls.apiWorkplace}/api/v1/races/`,
                records: `${appUrls.apiWorkplace}/api/v1/records/`,
                services: `${appUrls.apiWorkplace}/api/v1/services/`,
                serviceTypes: `${appUrls.apiWorkplace}/api/v1/service-types/`,
                upload: `${appUrls.apiWorkplace}/api/v1/upload/`,
                user: `${appUrls.auth}/api/v1/user/`,
                users: `${appUrls.auth}/api/v2/users/`,

                activity: `${appUrls.platform}/api/v1/activity/`,
                activityTag: `${appUrls.platform}/api/v1/tag/`,
                jiraIdea: `${appUrls.platform}/api/v3/jira/idea/`,
                room: `${appUrls.platform}/api/v1/room/`,
                roomResetWhiteboard: `${appUrls.platform}/api/v1/room/reset_whiteboard/`,
                video: `${appUrls.platform}/api/v1/video/`,
                recording: `${appUrls.platform}/api/v3/recording/`,

                techcheck: `${appUrls.apiTechcheck}/api/v1/techcheck/`,

                // homeFE: `${appUrls.platform}`,
                homeFE: `${appUrls.landing}`,
                platformFE: `${appUrls.platform}`,
                techcheckFE: `${appUrls.lightyear}/pl/setup/`,
                changePasswordFE: `${appUrls.auth}/password/change`,
                helpDocsFE: `https://presencelearning.helpjuice.com`,
                trainingFaqFE: `https://www.presencelearning.com/welcome-to-the-presencelearning-environment/`,
                copyrightFE: `https://www.presencelearning.com/about/copyright-policy/`,
                codeOfConductFE: `https://www.presencelearning.com/about/code-of-conduct/`,
                privacyPolicyFE: `https://www.presencelearning.com/about/platform-license-privacy-policy,`,
                telehealthInstituteFE: 'https://apps.presencelearning.com/c/landing/launch-coassemble',
                adminFE: `${appUrls.admin}`,
                roomFE: `${appUrls.lightyear}`,
                libraryFE: `${appUrls.toychest}`,
                billingFE: `${appUrls.hamm}`,
                clientsFE: `${appUrls.rex}`,
                scheduleFE: `${appUrls.woody}`,
                eduClientsFE: `${appUrls.eduClients}`,
                landingFE: `${appUrls.landing}`,
                workplaceFE: `${appUrls.apiWorkplace}`,
            };
        }

        this.plUrls.setUrlsDefaults(urls);
        this.plUrls.formUrls();
    }

    setErrorMessages() {
        const clientStudentText = PLClientStudentDisplayService.get(this.currentUser);
        const messages = {
            'clients': [
                { code: 401, msg: `You do not have access to these ${clientStudentText}s` }
            ],
            'evaluations/:uuid': [
                { code: 400, status: 'The evaluation can\'t be completed because it has appointments in the future',
                 msg: 'The evaluation can\'t be completed because it has appointments in the future'},
            ],
            'invoices/:uuid/retract': [
                // { code: 403, fxn: (err) => {
                //         return err.status;
                //     }
                // },
                { code: 403, msg: 'This invoice has already been processed and cannot be retracted.'},
            ],
            'clients/:uuid/providers': (err: any) => {
                if (err && err.error && err.error.length) {
                    return '* ' + err.error[0];
                }
                return this.genericErrorMessage;
            },
            'records/:uuid': (err: any) => {
                if (err && err.error) {
                    if (err.error['non_field_errors'] && err.error['non_field_errors'].length) {
                        return `${err.error['non_field_errors'][0]}`;
                    }
                }
            },
            // 'clients/:uuid/providers': [
            //     { code: 400, msg: `Client cannot be removed from caseload. You have unsigned appointments.` },
            // ],
        };
        this.plHttpError.setMessages(messages);
    }
}
