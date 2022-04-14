import '@tensorflow/tfjs-backend-webgl';
import * as bodyPix from '@tensorflow-models/body-pix';
import { ModelConfig } from '@tensorflow-models/body-pix/dist/body_pix_model';

// see: https://github.com/tensorflow/tfjs-models/tree/master/body-pix

export class FilteredCanvasService {
    net: bodyPix.BodyPix;
    loadingNet: Promise<void>;

    constructor() {
        this.loadingNet = this.loadNet();
    }

    async loadNet() {
        this.net = await bodyPix.load();
    }

    async pixelateFaces(img) {
        return this.loadingNet.then(async () => {
            const partSegmentation = await this.net.segmentPersonParts(img);

            // The colored part image is an rgb image with a corresponding color from the
            // rainbow colors for each part at each pixel, and white pixels where there is
            // no part.
            const coloredPartImage = bodyPix.toColoredPartMask(partSegmentation);
            const opacity = 0.7;
            const flipHorizontal = false;
            const maskBlurAmount = 0;
            const pixelCellWidth = 10.0;

            const canvas: any = document.createElement('canvas');

            // Draw the pixelated colored part image on top of the original image onto a
            // canvas.  Each pixel cell's width will be set to 10 px. The pixelated colored
            // part image will be drawn semi-transparent, with an opacity of 0.7, allowing
            // for the original image to be visible under.
            bodyPix.drawPixelatedMask(
                canvas, img, coloredPartImage, opacity, maskBlurAmount,
                flipHorizontal, pixelCellWidth);

            return canvas;
        });
    }

    async blurFaces(img) {
        return this.loadingNet.then(async () => {
            const partSegmentation = await this.net.segmentPersonParts(img);

            const blurAmount = 9;
            const edgeBlurAmount = 3;
            const flipHorizontal = false;
            const faceBodyPartIdsToBlur = [0, 1];

            const canvas: any = document.createElement('canvas');

            bodyPix.blurBodyPart(
                canvas, img, partSegmentation, faceBodyPartIdsToBlur,
                blurAmount, edgeBlurAmount, flipHorizontal);

            return canvas;
        });
    }

    getFilteredCanvas = (mediaStream) => {
        const WIDTH = 320;
        const HEIGHT = 240;
        const videoEl = document.createElement('video');
        videoEl.setAttribute('playsinline', '');
        videoEl.muted = true;

        const canvas: any = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const tmpCanvas = document.createElement('canvas');
        const tmpCtx = tmpCanvas.getContext('2d');
        tmpCanvas.width = WIDTH;
        tmpCanvas.height = HEIGHT;

        videoEl.addEventListener('resize', () => {
            canvas.width = tmpCanvas.width = videoEl.videoWidth;
            canvas.height = tmpCanvas.height = videoEl.videoHeight;
        });

        let playing = false;
        let segmentation;

        const backgroundBlurAmount = 7;
        const edgeBlurAmount = 5;
        const flipHorizontal = false;

        const MIN_DELAY = 66;
        let count = 0;
        const perform = async (net) => {
            segmentation = await net.segmentPerson(videoEl, { segmentationThreshold: 0.3 });
            while (playing) {
                const startTime = new Date().getTime();

                if (count++ === 1) {
                    segmentation = await net.segmentPerson(videoEl, { segmentationThreshold: 0.3 });
                    count = 0;
                }

                // segmentation takes an unknowable amount of time. Be sure to wait at least
                // MIN_DELAY between renders.
                const delta = new Date().getTime() - startTime;
                const delay = delta > MIN_DELAY ? 0 : MIN_DELAY - delta;
                await new Promise(r => setTimeout(r, delay));

                tmpCtx.drawImage(videoEl, 0, 0, tmpCanvas.width, tmpCanvas.height);
                bodyPix.drawBokehEffect(
                    canvas, tmpCanvas, segmentation, backgroundBlurAmount,
                    edgeBlurAmount, flipHorizontal);
            }
        };
        const options = {
            architecture: 'MobileNetV1',
            outputStride: 16,
            multiplier: 0.5,
            quantBytes: 2,
        } as ModelConfig;

        bodyPix.load(options).then((net) => {
            videoEl.srcObject = mediaStream;
            videoEl.addEventListener('loadeddata', (event) => {
                videoEl.play();
                playing = true;
                perform(net);
            })
        });

        return {
            canvas,
            stop: function stop() {
                // Stop the video element, the media stream and the animation frame loop
                videoEl.pause();
                if (mediaStream.stop) {
                    mediaStream.stop();
                }
                if (MediaStreamTrack && MediaStreamTrack.prototype.stop) {
                    // Newer spec
                    mediaStream.getTracks().forEach((track) => { track.stop(); });
                }
                playing = false;
            },
        };
    }
}

import { commonServicesModule } from './common-services.module';
import { async } from '@angular/core/testing';
commonServicesModule.service('filteredCanvasService', [FilteredCanvasService]);
