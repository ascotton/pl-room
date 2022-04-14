import { Injectable } from '@angular/core';
import { PLWidget } from '../pl-widget.model';

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
@Injectable()
export class PLDiceWidgetService {
    config: PLWidget = {
        type: 'dice-widget',
        name: 'Dice',
        icon: 'dice',
        params: {
            callerId: null,
            type: 'dots',
            dice: [1, 2, 3, 4, 5],
            dices: 1,
            counter: true,
            colored: false,
            animating: false,
            numberOfSides: 6,
            selectedSides: ['1', '2', '3', '4', '5', '6'],
        },
        settings: [
            { type: 'range', param: 'dices', min: 1, max: 5 },
            { type: 'checkbox', param: 'colored', desc: 'Multi-color dice' },
            { type: 'checkbox', param: 'counter', desc: 'Show dice total' },
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

    readonly DICE_TYPES = [
        {
            value: 'dots',
            label: 'Dots',
        },
        {
            value: 'letters',
            label: 'Letters',
        },
        {
            value: 'numbers',
            label: 'Numbers',
        },
        {
            value: 'colors',
            label: 'Colors',
        },
    ];

    readonly options = {
        letters: letters.split(''),
        colors: ['red', 'yellow', 'blue', 'green', 'orange', 'purple'],
        numbers: [],
        dots: [],
    }
    constructor() { 
        this.options.numbers = this.getNumberOptions();
        this.options.dots = this.getDotsOptions();
    }

    private getNumberOptions() {
        return this.getNumberArray(20);
    }

    private getDotsOptions() {
        return this.getNumberArray(6);
    }

    private getNumberArray(max) {
        const result = [];
        for (let i = 1; i <= max; i++) {
            result.push(String(i));
        }
        return result;
    }
}
