/**
 * Service for generate a guid
 *
 * @param $log
 */
const WebSafeFontsService = function() {

    const fonts = [
        {
            name: 'Georgia',
            family: 'Georgia, Times, Times New Roman, serif',
        },
        {
            name: 'Palatino',
            family: 'Palatino, Palatino Linotype, Palatino LT STD, Book Antiqua, Georgia, serif',
        },
        {
            name: 'TimesNewRoman',
            family: 'TimesNewRoman, Times New Roman, Times, Baskerville, Georgia, serif',
        },
        {
            name: 'Arial',
            family: 'Arial, Helvetica Neue, Helvetica, sans-serif',
        },
        {
            name: 'Arial Black',
            family: 'Arial Black, Arial Bold, Gadget, sans-serif',
        },
        {
            name: 'Comic Sans MS',
            family: 'Comic Sans MS',
        },
        {
            name: 'Impact',
            family: 'Impact, Haettenschweiler, Franklin Gothic Bold, Charcoal, Helvetica Inserat, ' +
                    'Bitstream Vera Sans Bold, Arial Black, sans serif',
        },
        {
            name: 'Lucida Grande',
            family: 'Lucida Grande, Lucida Sans Unicode, Lucida Sans, Geneva, Verdana, sans-serif',
        },
        {
            name: 'Tahoma',
            family: 'Tahoma, Verdana, Segoe, sans-serif',
        },
        {
            name: 'Trebuchet MS',
            family: 'Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif',
        },
        {
            name: 'Verdana',
            family: 'Verdana, Geneva, sans-serif',
        },
        {
            name: 'Courier New',
            family: 'Courier New, Courier, Lucida Sans Typewriter, Lucida Typewriter, monospace',
        },
        {
            name: 'Lucida Console',
            family: 'Lucida Console, Lucida Sans Typewriter, monaco, Bitstream Vera Sans Mono, monospace',
        },
    ];

    return fonts;
};

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('webSafeFontsService', WebSafeFontsService);
