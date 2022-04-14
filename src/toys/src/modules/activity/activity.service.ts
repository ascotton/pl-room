export class ActivityService {
    static $inject = ['$log', 'activityModel', 'guidService', 'flashCards'];

    constructor(private $log, private activityModel, private guidService, private flashCards) {
        $log.debug('[ActivityService] Creating activity service');
    }

    startup(activity, token = null) {
        if (activity.id === this.activityModel.activity.activityId) {
            return this.activityModel.foundationLoaded;
        }

        this.reset();
        this.activityModel.setActivityId(activity.id)
                    .setConfigId(activity.slug)
                    .setActivityType(activity.activity_type)
                    .setType(activity.type);

        if (activity.type === 'instant_youtube') {
            this.activityModel.activity.config = activity.config;
        }

        if (activity.session_id) {
            // enable firebase
            this.activityModel.setSessionId(activity.session_id).setShared(true);
            this.$log.debug('[WorkspaceDirective] sharing enabled.');
        } else {
            // skip firebase
            this.activityModel.setSessionId(this.guidService.generateUUID()).setShared(false);
            this.$log.debug('[WorkspaceDirective] sharing disabled.');
        }
        this.activityModel.initialize(activity.descriptor ? activity : undefined, token);

        return this.activityModel.foundationLoaded;
    }

    reset() {
        this.flashCards.clean();
        this.activityModel.reset();
    }
}

import { toysModule } from '../../toys.module';
toysModule.service('activityService', ActivityService);
