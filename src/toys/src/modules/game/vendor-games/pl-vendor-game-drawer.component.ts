import { Component, OnInit, Input } from '@angular/core';
import { PLVendorGameService } from './pl-vendor-game.service';

@Component({
    selector: 'pl-vendor-game-drawer',
    templateUrl: './pl-vendor-game-drawer.component.html',
    styleUrls: ['./pl-vendor-game-drawer.component.less'],
})
export class PLVendorGameDrawerComponent implements OnInit {

    @Input() activity: any;

    constructor(
        private vendorGameService: PLVendorGameService,
    ) { }

    ngOnInit() { }

}
