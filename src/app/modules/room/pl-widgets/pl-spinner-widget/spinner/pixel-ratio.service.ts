import { isArray, isFunction } from 'lodash';

export class PixelRatioService {
    canvas = [];
    paramsMap = [];
    callback = [];
    pixelRatio: any;
    constructor() {
        this.pixelRatio = window.devicePixelRatio;
    }

    pixelRatioChanged() {
        this.map.bind(this);
    }

    addCanvas(canvas) {
        this.canvas.push(canvas);
        this.paramsMap[canvas] = {
            context: canvas.getContext('2d'),
            width: 0 + canvas.width,
            height: 0 + canvas.height,
        };
        return this;
    }

    eachCanvas(canvas) {
        if (isArray(canvas)) {
            for (let i = 0; i < canvas.length; i++) {
                this.addCanvas(canvas[i]);
            }
        } else {
            this.addCanvas(canvas);
        }
    }

    push(canvas) {
        this.eachCanvas(canvas);
        return this;
    }

    map(force) {
        const pixelRatio = window.devicePixelRatio || 1;

        if (force !== true && pixelRatio === this.pixelRatio) {
            return;
        }

        this.pixelRatio = pixelRatio;

        this.canvas.forEach((canvas) => {
            this.setNewCanvasSize(canvas, this.paramsMap[canvas], pixelRatio);
        });
        if (force === true) {
            return;
        }
        this.callback.forEach((callback) => {
            if (isFunction(callback)) {
                callback();
            }
        });
    }

    addCallback(callback) {
        if (isFunction(callback)) {
            this.callback.push(callback);
        }
        return this;
    }

    setNewCanvasSize(canvas, params, pixelRatio) {
        const oldWidth = params.width;
        const oldHeight = params.height;
        const context = params.context;
        const backingStoreRatio = context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
        const ratio = pixelRatio / backingStoreRatio;

        canvas.width = oldWidth * ratio;
        canvas.height = oldHeight * ratio;

        canvas.style.width = oldWidth + 'px';
        canvas.style.height = oldHeight + 'px';

        context.scale(ratio, ratio);
    }
}
