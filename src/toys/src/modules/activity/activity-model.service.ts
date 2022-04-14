import * as angular from 'angular';
import { bind, each, keys } from 'lodash';

export class ActivityModel {
    defaults = {};
    activity: any;
    oldDefer: any;
    private loadedDefer: any;
    foundationLoaded: any;
    share: boolean;
    channel: any;
    getRef: any;
    configModel: any;
    configErrorCode: any;
    ref: any;
    getSessionRef: () => any;

    constructor(protected $log, private $q, private $timeout, protected firebaseModel,
                private drfActivityModel, private drfAssessmentModel, private ChannelService,
                private applications, private $http) {
        $log.debug('[ActivityModel] Creating ActivityModel');
        this.reset();
    }

    reset() {
        this.$log.debug('[ActivityModel] reset');
        this.activity = angular.copy(this.defaults);

        this.oldDefer = this.loadedDefer;
        this.loadedDefer = this.$q.defer();
        this.foundationLoaded = this.loadedDefer.promise;
        this.share = false;
        delete this.channel;
        this.channel = this.ChannelService.build();
        if (this.oldDefer) {
            this.oldDefer.notify('reset');
        }
        delete this.oldDefer;
        return this;
    }

    /**
     * Fields
     */

    /**
     * activityId (activity type)
     * @param id
     * @return ActivityModel
     */
    setActivityId(id) {
        this.activity.activityId = id;
        return this;
    }

    getActivityId() {
        return this.activity.activityId;
    }

    /**
     * configId (database location)
     * @param id
     * @return ActivityModel
     */
    setConfigId(id) {
        this.activity.configId = id;
        return this;
    }

    getConfigId() {
        return this.activity.configId;
    }

    setActivityType(type) {
        this.activity.activityType = type;
        return this;
    }

    getActivityType() {
        return this.activity.activityType;
    }

    setType(type) {
        this.activity.type = type;
        return this;
    }

    getType() {
        return this.activity.type;
    }

    setChannel(channel) {
        this.channel = channel;
        return this;
    }

    getChannel() {
        return this.channel;
    }

    /**
     * sessionId (firebase location)
     * @param id
     */
    setSessionId(id) {
        this.activity.sessionId = id;
        return this;
    }

    getSessionId() {
        return this.activity.sessionId;
    }

    /**
     * Set the mode to shared or not shared (e.g. remote saving)
     * @param value
     */
    setShared(value) {
        this.share = value;
        if (this.share) {
            this.getRef = this.firebaseModel.getFirebaseRef;
        } else {
            console.error(`firebasemock was removed, if see this,
                need to replace it or prevent from getting here in the first place.`);
            // this.getRef = (name) => {
            //     return new this.firebaseMock(name);
            // };
        }
        try {
            this.getSessionRef = () => {
                if (this.getSessionId()) {
                    return this.firebaseModel.getFirebaseRef('activities/sessions/').child(this.getSessionId());
                }
            };

        } catch(e) {
            this.$log.debug('error in getSessionRef in setShared in activityModel: ', e);
        }
        return this;
    }

    /**
     * Setup the load and value handlers for the remote object
     */
    initialize(model, token = null) {
        this.getActivityConfig(model, token);
        return this;
    }

    getActivityConfig(model, token = null) {
        switch (this.activity.type) {
                case 'assessment':
                    this.configModel = this.drfAssessmentModel;
                    break;
                case 'activity':
                default:
                    this.configModel = this.drfActivityModel;
        }
        this.configModel.init();
        this.configModel.setKey(this.getActivityId());
        this.configErrorCode = null;

        if (this.activity.type === 'instant_youtube') {
            this.loadedDefer.resolve(this);
        } else {
            this.configModel.get(token)
            .subscribe(
                () => this.handleConfigValue(this.configModel.model),
                (error) => {
                    if (error.status === 404 || error.status === 403) {
                        this.configErrorCode = error.status;
                        this.handleConfigError(error);
                    }
                },
            );
        }
        return this;
    }

    /**
     * Handlers
     */
    handleConfigValue(config) {
        this.$log.debug('[ActivityModel] activity ref loaded:' + config);
        this.$log.debug('[ActivityModel] config.descriptor:' + config.descriptor);
        if (config === undefined || config.descriptor === undefined) {
            this.$log.debug('[ActivityModel] no activity config.descriptor found');
            this.$log.error('Cannot load activity');
            return;
        }
        const configJson = JSON.parse(config.descriptor);

        if (configJson == null) {
            this.$log.error('[ActivityModel] config data is null');

        } else {
            this.$timeout(bind(function() {
                // Handle image decks.
                if (configJson.imageDeck) {
                    const imageDeck = configJson.imageDeck;
                    const url = `${this.applications.platform.url}/api/v1/activity/${imageDeck.id}/`;
                    const data = {
                        id: imageDeck.id,
                    };
                    this.$http({ method: 'GET', url: url, data: data }).then((res) => {
                        const data = res.data;
                        // Mimic old cards version.
                        const descriptor = {
                            title: data.name,
                            description: data.description,
                            cards: [],
                        };
                        const descriptorImageDeck = data.descriptor ? JSON.parse(data.descriptor) : {};
                        if (descriptorImageDeck.images) {
                            descriptorImageDeck.images.forEach((image, index) => {
                                descriptor.cards.push({
                                    id: index + 1,
                                    title: '',
                                    url: image.url,
                                    thumbnail_url: image.url,
                                    type: 'image',
                                });
                            });
                        }
                        this.activity.config = descriptor;
                        this.loadedDefer.resolve(this);
                    });
                } else {
                    const keys1 = keys(configJson);
                    let configRoot = {};
                    if (keys1.length === 1) {
                        configRoot = configJson[keys1[0]];
                    } else {
                        each(keys1, (item) => {
                            configRoot[item] = configJson[item];
                        });
                    }
                    this.$log.debug('[ActivityModel] setting config on model: ', configRoot);
                    this.activity.config = configRoot;
                    this.activity.thumbnails = config.page_thumbnails;
                    this.loadedDefer.resolve(this);
                }
            },                   this));
        }
    }

    handleConfigError(error) {
        this.$log.debug('[ActivityModel] activity ref load error:', error);
        this.loadedDefer.reject(this);
    }

    /**
     * Persistence methods
     */
    updateActivity() {
        if (this.share) {
            this.ref.set(this.activity);
        }
        return this;
    }
}

const activityModel = angular.module('toys').service('activityModel', [
    '$log', '$q', '$timeout', 'firebaseModel', 'drfActivityModel', 'drfAssessmentModel', 'ChannelService',
    'applications', '$http',
    ActivityModel,
]);
