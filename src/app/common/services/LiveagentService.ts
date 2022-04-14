declare var liveagent: any;

export class LiveagentService {
    static $inject = ['$log', '$timeout', 'liveagent_conf', 'currentUserModel', 'remoteLogging'];

    state = {
        chatAvailable: false,
    };
    startChat() {
        if (this.state.chatAvailable && typeof liveagent !== 'undefined') {
            this.$timeout(() => { // collides with youtube api $apply
                liveagent.startChat(this.liveagent_conf.buttonId);
            },            1);
        }
    };
    constructor ($log, private $timeout, private liveagent_conf, currentUserModel, remoteLogging) {
        const buttonCallback = (e) => {
            if (e === liveagent.BUTTON_EVENT.BUTTON_AVAILABLE) {
                this.state.chatAvailable = true;
            }
            if (e === liveagent.BUTTON_EVENT.BUTTON_UNAVAILABLE) {
                this.state.chatAvailable = false;
            }

            if (e === liveagent.BUTTON_EVENT.BUTTON_ACCEPTED) {
                // if you don't return true here then the chat popup fails
                return true;
            }

            if (e === liveagent.BUTTON_EVENT.BUTTON_REJECTED) {
            }

            $timeout(() => {});
            return false;
        };

        if (typeof liveagent !== 'undefined') {
            liveagent.addButtonEventHandler(liveagent_conf.buttonId, buttonCallback);
            if (currentUserModel.user != null) {
                liveagent.setName(currentUserModel.user.getName());
            } else {
                liveagent.setName('guest');
            }
            liveagent.init(liveagent_conf.endpoint, liveagent_conf.initArg1, liveagent_conf.initArg2);

            // without this, the callback doesn't fire
            liveagent.showWhenOnline(liveagent_conf.buttonId, null);
        } else {
            // Techcheck used this remote log: remoteLogging.logToSentry('liveagent undefined');
            $log.error('liveagent undefined in LiveagentService!');
        }
    }

};

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('liveagentService', LiveagentService);
