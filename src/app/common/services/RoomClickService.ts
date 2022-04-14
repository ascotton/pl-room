/**
 * @param $log
 * @param $timeout
 */
export class RoomClickService {
    constructor(private $log, private $timeout) {
    }
    methods = {
        drawer: {
            dragStart: () => {
                this.setShapesNonInteractive();

                $('.whiteboard').css('pointer-events', 'none');
                $('widgets-board *').css('pointer-events', 'none');
            },

            dragEnd: () => {
                this.setShapesInteractive();

                $('.whiteboard').css('pointer-events', '');
                $('widgets-board *').css('pointer-events', '');
            }
        },

        workspace: {
            dragStart: () => {
                this.setShapesNonInteractive();

                $('.whiteboard').css('pointer-events', 'none');
                $('widgets-board *').css('pointer-events', 'none');
            },

            dragEnd: () => {
                this.setShapesInteractive();

                $('.whiteboard').css('pointer-events', '');
                $('widgets-board *').css('pointer-events', '');
            }
        }
    };

    setShapesInteractive = () => {
        $('whiteboard, whiteboard .whiteboard-content').css('pointer-events', 'auto');
        $('whiteboard .whiteboard-content *').css('pointer-events', 'auto');
    }

    setShapesNonInteractive = () => {
        $('whiteboard, whiteboard .whiteboard-content').css('pointer-events', 'none');
        $('whiteboard .whiteboard-content *').css('pointer-events', 'none');
    }

    setWidgetboardInteractive = () => {
        $('widgets-board').css('pointer-events', 'auto');
    }

    setWidgetboardNonInteractive = () => {
        $('widgets-board').css('pointer-events', 'none');
    }

    dragstart = () => {
        this.$log.debug('[RoomClickService] Drag start, disable pointer events on svg and widget container');
        this.setShapesNonInteractive();
        this.setWidgetboardInteractive();

        $('widgets-board').addClass('interactive');
    }

    dragend = () => {
        this.$log.debug('[RoomClickService] Drag end, enable pointer events on svg and widget container');
        this.setShapesInteractive();
        this.setWidgetboardNonInteractive();
        $('widgets-board').removeClass('interactive');
    }

    trigger = (type, methodName) => {
        const method = this.methods[type];
        if (!method) {
            return;
        }
        if (method[methodName]) {
            method[methodName]();
        }
    }
}

import { commonServicesModule } from './common-services.module';
commonServicesModule.service('RoomClickService', [
    '$log',
    '$timeout',
    RoomClickService,
]);
