import { Component } from '@angular/core';

import { AngularCommunicatorService } from
    '../../../../app/downgrade/angular-communicator.service';

import { PLVendorGameService } from './vendor-games'

@Component({
    selector: 'pl-game',
    templateUrl: './pl-game.component.html',
    styleUrls: ['./pl-game.component.less'],
})
export class PLGameComponent {
    activity: any = {};

    constructor(
        private angularCommunicator: AngularCommunicatorService,
        private vendorGameService: PLVendorGameService,
    ) {}

    ngOnInit() {
        this.activity = this.angularCommunicator.activeActivity;
    }

    isVendorGame(activity) {
        return this.vendorGameService.isVendorGame(activity);
    }
}
