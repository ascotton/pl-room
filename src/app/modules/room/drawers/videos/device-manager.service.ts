
class DeviceManagerService {
    static $inject = [
        '$log',
        '$q',
    ];

    audioInputDevices: any[];
    videoInputDevices: any[];

    claimedVideoDevices: any[] = [];
    cameraCount = 0;
    unclaimedCount = 0;

    constructor(private $log, private $q) {

    }

    resetAll() {
        this.audioInputDevices = [];
        this.videoInputDevices = [];

        this.claimedVideoDevices = [];
        this.cameraCount = 0;
        this.unclaimedCount = 0;
    }

    private findDeviceById = (deviceArray, id) => {
        return deviceArray.find((device) => {
            return device && device.deviceId === id;
        });
    }

    private hasSuggestedDevice = (suggestedVideoDevice) => {
        return this.findDeviceById(this.videoInputDevices, suggestedVideoDevice.deviceId);
    }

    private hasSuggestedAudioDevice = (suggestedAudioDevice) => {
        return this.findDeviceById(this.audioInputDevices, suggestedAudioDevice.deviceId);
    }

    // device is being published somewhere, claim it
    claimDevice(device, isSecondary) {
        if (!this.findDeviceById(this.claimedVideoDevices, device.deviceId)) {
            this.claimedVideoDevices.push(device);
            if (isSecondary) {
                localStorage.setItem('plSecondaryVideoDeviceId', device.deviceId);
            } else {
                localStorage.setItem('plPrimaryVideoDeviceId', device.deviceId);
            }
        }
        this.unclaimedCount = this.videoInputDevices.length - this.claimedVideoDevices.length;
    }

    // device is no longer being published somewhere, free it for use
    freeDevice(device) {
        this.claimedVideoDevices = this.claimedVideoDevices.filter((claimedDevice) => {
            return claimedDevice.deviceId !== device.deviceId;
        });
        this.unclaimedCount = this.videoInputDevices.length - this.claimedVideoDevices.length;
    }

    // find the first device after startAfterIndex that is not a published device. search is
    // cyclical and in the current order videoInputDevices
    // returns null
    private findAvailableDevice(startAfterIndex) {
        const publishedDevices = this.claimedVideoDevices;
        let availableDevice = null;
        for (let i = startAfterIndex + 1; i < this.videoInputDevices.length; i++) {
            const device = this.videoInputDevices[i];
            const foundPublishedDevice = this.findDeviceById(publishedDevices, device.deviceId);
            if (!foundPublishedDevice) {
                availableDevice = device;
                break;
            }
        }
        // if we haven't found one yet and we didn't start at the beginning, go to the beginning
        if (startAfterIndex > -1 && !availableDevice) {
            for (let i = 0; i < startAfterIndex; i++) {
                const device = this.videoInputDevices[i];
                const foundPublishedDevice = this.findDeviceById(publishedDevices, device.deviceId);
                if (!foundPublishedDevice) {
                    availableDevice = device;
                    break;
                }
            }
        }
        return availableDevice;
    }

    // if there is an available device after the current device, returns it, otherwise returns currentDevice
    private getNextAvailableVideoDevice(currentDevice) {
        let currentDeviceIndex = -1;
        for (let i = 0; i < this.videoInputDevices.length; i++) {
            if (this.videoInputDevices[i].deviceId === currentDevice.deviceId) {
                currentDeviceIndex = i;
                break;
            }
        }
        const nextAvailableVideoDevice = this.findAvailableDevice(currentDeviceIndex);
        return nextAvailableVideoDevice ? nextAvailableVideoDevice : currentDevice;
    }

    private getFirstAvailableVideoDevice = () => {
        return this.findAvailableDevice(-1);
    }

    findLastVideoDevice(isSecondary) {
        let id;
        if (isSecondary) {
            id = localStorage.getItem('plSecondaryVideoDeviceId');
        } else {
            id = localStorage.getItem('plPrimaryVideoDeviceId');
        }
        if (id) { // } && !this.findDeviceById(this.claimedVideoDevices, id)) {
            return this.findDeviceById(this.videoInputDevices, id);
        } 
    }

    findLastAudioDevice() {
        const id = localStorage.getItem('plPrimaryAudioDeviceId');
        if (id) {
            return this.findDeviceById(this.audioInputDevices, id);
        }
    }

    async getDeviceList() {
        const deferred = this.$q.defer();
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        OT.getDevices(async (error1, devices1) => {
            if (error1) {
                console.log(
                    '[DeviceManagerService.getDevices()] OT getDevices error: \n\terror: ',
                    error1, '\n\tdevices: ', devices1);
                deferred.reject(error1);
            } else {
                const hasVideoDevice = devices1.find(
                    device =>
                        device.kind === 'videoInput' && device.deviceId && device.deviceId !== '',
                );
                const hasAudioDevice = devices1.find(
                    device =>
                        device.kind === 'audioInput' && device.deviceId && device.deviceId !== '',
                );
                if (!(hasVideoDevice && hasAudioDevice)) {
                    try {
                        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                        OT.getDevices((error2: any, devices2: any) => {
                            if (error2) {
                                deferred.reject(error2);
                            }
                            deferred.resolve(devices2);
                        });
                    } catch (error) {
                        deferred.reject(error);
                    }
                } else {
                    deferred.resolve(devices1);
                }
            }
        });

        return deferred.promise;
    }

    getDevices(suggestedVideoDevice, findAfterVideoDevice, isSecondary) {
        const deferred = this.$q.defer();
        let videoDevice: any;
        let audioDevice: any;

        this.getDeviceList().then((devices) => {

            // search the devices and generate lists of audio and video input devices.
            this.videoInputDevices = devices.filter(item => item.kind === 'videoInput');
            this.audioInputDevices = devices.filter(item => item.kind === 'audioInput');
            this.cameraCount = this.videoInputDevices.length;

            const lastAudioDevice = this.findLastAudioDevice();
            if (lastAudioDevice && this.hasSuggestedAudioDevice(lastAudioDevice)) {
                audioDevice = lastAudioDevice;
            } else {
                audioDevice = this.audioInputDevices[0];
            }

            // if (!republish || !audioDevice) {
                // if there's a device at the desired index, use it, otherwise use the 0th one.
                // if (audioInputDevices.length - 1 >= cameraIndex) {
                //     audioDevice = audioInputDevices[cameraIndex];
                // } else if (audioInputDevices.length > 0) {
                //     audioDevice = audioInputDevices[0];
                // }
            // }

            if (suggestedVideoDevice && this.hasSuggestedDevice(suggestedVideoDevice)) {
                videoDevice = suggestedVideoDevice;
            } else if (findAfterVideoDevice) {
                const availableDevice = this.getNextAvailableVideoDevice(findAfterVideoDevice);
                videoDevice = availableDevice;
            } else {
                const lastDevice = this.findLastVideoDevice(isSecondary);
                if (lastDevice) {
                    videoDevice = lastDevice;
                } else {
                    videoDevice = this.getFirstAvailableVideoDevice();
                }
            }
            if (this.findDeviceById(this.claimedVideoDevices, videoDevice.deviceId)) {
                this.$log.log('DeviceManager: can\'t use suggested video device, reverting to first available');
                videoDevice = this.getFirstAvailableVideoDevice();
            }

            let videoDeviceMissing = false;
            let audioDeviceMissing = false;
            if (!videoDevice || !videoDevice.deviceId) {
                this.$log.error(
                    '[DeviceManagerService.getDevices()] No video device was found. \n\tDevices found: ', devices);
                videoDeviceMissing = true;
            }
            if (!audioDevice || !audioDevice.deviceId) {
                this.$log.error(
                    '[DeviceManagerService.getDevices()] No audio device was found. \n\tDevices found: ', devices);
                audioDeviceMissing = true;
            }
            if (audioDeviceMissing || videoDeviceMissing) {
                this.$log.error('[DeviceManagerService.getDevices()] Audio or Video device is missing. Aborting publish');
                deferred.reject();
            } else {
                deferred.resolve({ audioDevice, videoDevice });
            }
        }, (error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }

}

import { videosModule } from './videos.module';

videosModule.service('deviceManager', DeviceManagerService);
