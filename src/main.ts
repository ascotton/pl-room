import { setAngularJSGlobal } from '@angular/upgrade/static';
import angular from 'angular';

import { enableProdMode, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UIRouter, UrlService } from '@uirouter/core';

import { environment } from './environments/environment';

import { AppModule } from './app/app.module';
import { appModuleAngularJS } from './app/app.module.ajs';
// import { visualizer } from '@uirouter/visualizer';

declare global {
    interface Window {
        roomGlobal: RoomGlobal;
    }

    interface RoomGlobal {
        isIPadSafari?: boolean;
        showingYoutubeLootBox?: boolean;
    }
}

appModuleAngularJS.config(['$urlServiceProvider', ($urlService: UrlService) => $urlService.deferIntercept()]);

if (environment.production) {
    enableProdMode();
}

// We need to get angular js as a global.
// https://github.com/angular/angular/issues/16484#issuecomment-298852692
setAngularJSGlobal(angular);
platformBrowserDynamic().bootstrapModule(AppModule).then((platformRef) => {
  // Intialize the Angular Module
  // get() the UIRouter instance from DI to initialize the router
    const urlService: UrlService = platformRef.injector.get(UIRouter).urlService;

  // Instruct UIRouter to listen to URL changes
    function startUIRouter() {
        urlService.listen();
        urlService.sync();
    }

    platformRef.injector.get<NgZone>(NgZone).run(startUIRouter);
});

// Show ui-router-visualizer
// appModuleAngularJS.run(['$uiRouter', ($uiRouter) => visualizer($uiRouter) ]);
