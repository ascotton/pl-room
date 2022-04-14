

class NotificationService {
    constructor() {
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    }

    notify(title, message, icon, audioUrl) {
        let notification = null;

        // Typescript typings for Notification are wrong, hence: Notification['permission']
        // https://stackoverflow.com/questions/48221751/why-vscode-does-not-know-notification-permission-in-typescript?rq=1
        if ('Notification' in window && Notification['permission'] === 'granted') {
            const options = {
                body: message,
                icon,
            };
            notification = new Notification(title, options);

            // Firefox on Mac plays its own audio during a Notification, so don't
            // play audio there.
            const isMac = navigator.appVersion.indexOf('Mac') !== -1;
            const isFirefox = $('html').hasClass('firefox');
            if (audioUrl && !(isFirefox && isMac)) {
                try {
                    new Audio(audioUrl).play().then((res) => {
                    }).catch((error) => {
                        console.log('Doorbell error: ', error);
                    });
                } catch(e) {
                    console.log('Doorbell error: ', e);
                }
            }
        } else if (audioUrl) {
            // if Notifications aren't supported or are disabled, just play the sound
            try {
                new Audio(audioUrl).play().then((res) => {
                }).catch((error) => {
                    console.log('Doorbell error: ', error);
                });
            } catch(e) {
                console.log('Doorbell error: ', e);
            }
        }
        return notification;
    }

}

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('notificationService', NotificationService);
