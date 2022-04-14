import { Injectable } from '@angular/core';
import { PLWidget } from '../pl-widget.model';

@Injectable()
export class PLStopwatchWidgetService {
    config: PLWidget = {
        type: 'stopwatch-widget',
        name: 'Stopwatch',
        icon: 'stopwatch',
        params: {
            movable: true,
            status: null,
            overallTime: null,
            start: null,
        },
        settings: [],
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
