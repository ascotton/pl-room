import * as angular from 'angular';
import { videosModule } from './drawers/videos';
import { whiteboardModule } from './whiteboard';
import { whiteboardcommonModelsModule } from './whiteboard/models';
import { toolsModule } from './whiteboard/tools';
import { shapesModule } from './whiteboard/shapes';
import { whiteboardToolbarModule } from './whiteboard/whiteboardtoolbar';

export const roomModule = angular.module('room.room', [
    'ui.router',
    // videosModule.name,
    whiteboardModule.name,
    whiteboardcommonModelsModule.name,
    toolsModule.name,
    shapesModule.name,
    whiteboardToolbarModule.name,
]);
