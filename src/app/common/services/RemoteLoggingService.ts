/**
 * Central location for making calls to server side logging services and analytics (Raven/Sentry, Heap, JIRA, etc...)
 */
import * as Sentry from '@sentry/browser';

class RemoteLoggingService {
    static $inject = ['$log', 'currentUserModel', 'roomnameModel'];
    _currentUserModel: any;
    _roomnameModel: any;
    log: any;
    constructor($log, currentUserModel, roomnameModel) {
        this._currentUserModel = currentUserModel;
        this._roomnameModel = roomnameModel;
        this.log = $log;
    }

    setUser() {
        const name = this._currentUserModel.user ? this._currentUserModel.user.getName() : '';
        Sentry.setUser({
            username: name,
        });
    }

    logToSentry(message) {
        this.setUser();
        if (this._roomnameModel.value && this._roomnameModel.value.id) {
            Sentry.setTag('roomID', this._roomnameModel.value.id);
        }
        Sentry.captureMessage(message);
    }

    logTokboxErrorToSentry(context, session, error) {
        // disable sentry logging for now
        if (true || Math.random() > 0.01) {
            this.log.debug('Rate limiting sentry log...');
            return;
        }

        let message = context;
        if (error) message += ': ' + error.code + ' - ' + error.message;
        this.setUser();
        const tokboxSessionId = session ? session.sessionId : 'unknown';
        const tokboxConnectionId = (session && session.connection) ? session.connection.connectionId : 'unknown';
        const options = {
            tags: {
                tokboxSessionId,
                tokboxConnectionId,
                roomID: null
            },
        };
        if (this._roomnameModel.value && this._roomnameModel.value.id) {
            options.tags.roomID = this._roomnameModel.value.id;
        }
        
        Sentry.withScope(scope => {
            Object.keys(options).forEach((key) => {
                scope.setExtra(key, options[key]);
            });
          Sentry.captureMessage(message);
        });
    }

}

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('remoteLogging', ['$log', 'currentUserModel', 'roomnameModel', RemoteLoggingService]);
