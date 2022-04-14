import { Injectable } from '@angular/core';
import { PLWidget } from '../pl-widget.model';

@Injectable()
export class PLSpinnerWidgetService {
    config: PLWidget = {
        type: 'spinner-widget',
        name: 'Spinner',
        icon: 'spinner',
        params: {
            movable: true,
            numberOfSectors: 10,
            isRotating: false,
            currentRotationAngle: null,
            currentRotationSpeed: null,
        },
        settings: [
            { type: 'range', param: 'numberOfSectors', min: 2, max: 10 },
        ],
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
