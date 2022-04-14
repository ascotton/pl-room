import { Injectable } from '@angular/core';
import { PLWidget } from '../pl-widget.model';

@Injectable()
export class PLTimerWidgetService {
    config: PLWidget = {
        type: 'timer-widget',
        name: 'Timer',
        icon: 'timer',
        params: {
            movable: true,
            overallTime: 0,
            status: 'initial',
            defaultTime: 10000,
            audioEnabled: true,
            start: 0,
        },
        settings: [{
            type: 'audiocheckbox',
            param: 'audioEnabled',
            desc: 'Alert Sound',
        }],
        clicked: false,
        top_x: 0,
        top_y: 0,
        initial_top_x: 0,
        initial_top_y: 0,
        initial_width: 0,
        actions: {},
        opacity: 0,
        scaled: false,
        added: false,
        zIndex: -1,
        hidden: false,
    };
    constructor() { }
}
