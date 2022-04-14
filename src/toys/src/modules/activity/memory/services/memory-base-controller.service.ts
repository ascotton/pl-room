/**
 * Basic abstract controller class for inheriting by Memory Cards controllers
 * It provides common functionality implementation, for example, initializes
 * activity channel and implements generic methods for accessing it.
 * Also it provides an access to localStorage service, etc.
 *
 * @author Mykhailo Stadnyk <mstadnyk@lohika.com>
 */
export class MemoryBaseController {

    readonly KEY_XRAY = 'memorycards:x-ray';

    /**
     * @constructor
     * @param {ActivityModel} activityModel
     * @param {LocalStorageService} localStorage
     * @param {Object} userModel
     * @param {Object} options
     */
    constructor(protected activityModel, protected localStorage, private userModel, protected options) {
        this.initChannel();
    }

    /**
     * Returns true if currently looged-in user is clinician,
     * false otherwise
     *
     * @returns {boolean}
     */
    isClinician() {
        return this.userModel.user.isClinicianOrExternalProvider();
    }

    /**
     * Returns promise which will be resolved when the
     * cross-frame communication channel is ready
     *
     * @returns {Promise}
     */
    getChannel() {
        return new Promise((resolve) => {
            const channel = this.activityModel.channel;
            if (!channel) {
                this.activityModel.foundationLoaded.then(() =>
                    resolve(this.userModel.channel)
                );
            } else {
                resolve(channel);
            }
        });
    }

    /**
     * Abstract method which initializes channel.
     * Must be implemented by a child classes
     * it also MUST return resolution promise
     *
     * @throws TypeError if not implemented
     * @returns {Promise}
     */
    initChannel() {
        throw new TypeError('initChannel() method must be implemented in child class!');
    }
}
