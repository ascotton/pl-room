import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, OnDestroy, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RewardAnimationsService } from './reward-animations.service';
import { TweenLite, TimelineLite, Elastic } from 'gsap/all';
import { FirebaseAppModel } from '../../common/models/firebase/firebase-app-model.service';
import { Subscription } from 'rxjs';
import { ResizeObserverService } from '@common/services-ng2';

const rainbowColors = ['#ed8000', '#4d8bbe', '#78a240', '#f9b417', '#b665a6', '#bf253d'];

@Component({
    selector: 'pl-reward-animations',
    templateUrl: 'reward-animations.component.html',
    styleUrls: ['reward-animations.component.less'],
    providers: [
        ResizeObserverService,
    ],
})
export class RewardAnimationsComponent implements AfterViewInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    @ViewChild('rewardAnimation') rewardAnimationRef: ElementRef<HTMLDivElement>;
    @ViewChild('rewardTextContainer') rewardTextContainerRef: ElementRef<HTMLDivElement>;
    @ViewChild('rewardTextInnerContainer') rewardTextInnerContainerRef: ElementRef<HTMLDivElement>;
    @ViewChild('rewardText') rewardTextRef: ElementRef<HTMLDivElement>;
    @ViewChild('rewardGifContainer') rewardGifContainerRef: ElementRef<HTMLDivElement>;
    @ViewChild('rewardGifInnerContainer') rewardGifInnerContainerRef: ElementRef<HTMLDivElement>;
    @ViewChild('rewardGif') rewardGifRef: ElementRef<HTMLDivElement>;
    @ViewChild('reward_canvas_output') reward_canvas_outputRef: ElementRef<HTMLDivElement>;
    @ViewChild('mp4Source') mp4SourceRef: ElementRef<HTMLSourceElement>;
    @ViewChild('webmSource') webmSourceRef: ElementRef<HTMLSourceElement>;
    @ViewChild('reward_video_buffer') reward_video_bufferRef: ElementRef<HTMLCanvasElement>;
    @ViewChild('reward_video_output') reward_video_outputRef: ElementRef<HTMLCanvasElement>;

    private reward_videoRef: ElementRef<HTMLVideoElement>;
    @ViewChild('reward_video') set content(videoRef: ElementRef<HTMLVideoElement>) {
        if (videoRef) { // initially setter gets called with undefined
            this.reward_videoRef = videoRef;

            this.videoEl.load();
            this.renderer.setProperty(this.videoEl, 'currentTime', 0);
            this.renderer.setProperty(this.videoEl, 'muted', !this.currentAnimation.soundOn);
        }
    }

    playingText = false;
    playingGif = false;
    playingVideo = false;

    outputWidth: number;
    outputHeight: number;

    currentAnimation: any;

    rangeModeConfirmed = false;
    lowDynamicRange = false;
    rangeOffset = 0;
    rangeStretch = 1;
    rangeTestCount = 0;

    metadataLoaded = false;
    videoLoaded = false;

    retryCount = 0;
    processingFrame = false;
    gifPath = '';
    mp4Path = '';
    webmPath =  '';

    videoMetadataTimeout: NodeJS.Timeout;
    videoFallbackTimeout: NodeJS.Timeout;

    lastRenderTime = 0;

    getARCWidth = 0;

    get videoEl() {
        return this.reward_videoRef ? this.reward_videoRef.nativeElement : null;
    }
    get outputCanvas() {
        return this.reward_video_outputRef.nativeElement;
    }
    get bufferCanvas() {
        return this.reward_video_bufferRef.nativeElement;
    }
    get output() {
        return this.outputCanvas.getContext('2d');
    }
    get buffer() {
        return this.bufferCanvas.getContext('2d');
    }
    get rewardText() {
        return this.rewardTextRef.nativeElement;
    }

    constructor(
        private renderer: Renderer2,
        private domSanitizer: DomSanitizer,
        private resizeObserverService: ResizeObserverService,
        private firebaseAppModel: FirebaseAppModel,
        private rewardAnimationsService: RewardAnimationsService,
    ) {}

    ngAfterViewInit() {
        this.subscriptions.push(
            this.listenToARCResize(),
            this.listenToCurrentAnimation(),
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    listenToCurrentAnimation() {
        // watch for new values of this.rewardAnimationsService.queuedAnimation to play.
        return this.rewardAnimationsService.queuedAnimation$.subscribe((newVal) => {
            if (newVal) {
                setTimeout(() => {
                    this.metadataLoaded = false;
                    this.videoLoaded = false;
                    this.currentAnimation = newVal;
                    this.retryCount = 0;

                    if (!this.currentAnimation ||
                            (this.currentAnimation.name === 'empty' &&
                                (!this.currentAnimation.message || this.currentAnimation.message.length === 0))
                        ) {
                        this.videoEnded();
                    } else {
                        if (this.currentAnimation.name !== 'empty' && !this.currentAnimation.gifPath) {
                            if (window.roomGlobal.isIPadSafari) {
                                if (this.currentAnimation.fallbackGifPath) {
                                    this.handleGif(this.currentAnimation.fallbackGifPath);
                                }
                            } else {
                                this.handleVideo();
                            }
                        }
                        if (this.currentAnimation.message && this.currentAnimation.message.length > 0) {
                            this.handleText();
                        }
                        if (this.currentAnimation.gifPath) {
                            this.handleGif(this.currentAnimation.gifPath);
                        }
                    }
                });
            }
        });
    }

    listenToARCResize() {
        const arcEl = document.querySelector('.aspect-ratio-constriction');
        this.renderer.setStyle(this.rewardText, 'fontSize', `${arcEl.clientWidth / 8}px`);
        return this.resizeObserverService.observe(arcEl).subscribe(() => {
            this.renderer.setStyle(this.rewardText, 'fontSize', `${arcEl.clientWidth / 8}px`);
        });
    }

    // when video metadat is loaded, resize canvases accordingly so they are the same resolution as the video.
    // the reward_video_output is rendered at the video's resolution, but then stretched in CSS to the
    // workspace size.
    loadedMetadata() {
        this.metadataLoaded = true;
        this.outputWidth = this.videoEl.videoWidth;
        this.outputHeight = this.videoEl.videoHeight / 2;
        this.outputCanvas.width = this.outputWidth;
        this.outputCanvas.height = this.outputHeight;
        this.bufferCanvas.width = this.outputWidth;
        this.bufferCanvas.height = this.outputHeight * 2;
        clearTimeout(this.videoMetadataTimeout);

        // only play if both data and metadata have loaded
        if (this.videoLoaded) {
            this.videoEl.play().catch((error) => {
                console.log('error playing reward video: ', error);
            });
        }
    }

    // canPlayThrough is triggered when enough video data has loaded that it can be played without buffering
    canPlayThrough() {
        this.videoLoaded = true;
        // only play if both data and metadata have loaded
        if (this.metadataLoaded) {
            this.videoEl.play().catch((error) => {
                console.log('error playing reward video: ', error);
            });
        }
    }

    getVideoPath(type: string) {
        const safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.currentAnimation[type]);
        return this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
    }

    /**
     * When the video finishes playing, clear the interval call to processFrame(), set this.playing to false,
     * which removes the <video>, and let rewardAnimationsModel know we're done.
     */
    videoEnded() {
        clearTimeout(this.videoMetadataTimeout);
        clearTimeout(this.videoFallbackTimeout);
        if (this.firebaseAppModel.app.layoutMode === 'compact') {
            TweenLite.to(
                this.rewardAnimationRef.nativeElement, 0.25, { 'background-color': 'rgba(255, 255, 255, 0.0)' },
            );
        }
        setTimeout(
            () => {
                this.output.clearRect(0, 0, this.outputWidth, this.outputHeight);
                this.buffer.clearRect(0, 0, this.outputWidth, this.outputHeight * 2);
            },
            0,
        );
        this.rewardAnimationsService.dequeueAnimation(this.currentAnimation);

        this.renderer.setProperty(this.rewardText, 'innerText', '');
        if (this.playingVideo) {
            this.renderer.setAttribute(this.mp4SourceRef.nativeElement, 'src', '');
            this.renderer.setAttribute(this.webmSourceRef.nativeElement, 'src', '');
        }
        this.playingText = false;
        this.playingGif = false;
        this.playingVideo = false;

        if (this.processingFrame) {
            this.processingFrame = false;
        }
    }

    /**
     * There is a bug in Windows 7 which causes video to be rendered in a limited dyamic range, with pixel
     * values ranging from 16 to 235, rather than from 0 to 255. In color, this causes things to be generally
     * grayer, shabbier.
     * When we are using a video to supply our alpha values, the effect is much worse. Pixels that should be
     * completely transparent are now slightly opaque, so you see gray 'seams' at the edges of the transparent
     * video (alpha of 16 rather than 0.) . Pixels that should be completely opaque, like our animation
     * sprites, end up being somewhat translucent (alpha of 235 rather than 255.)
     *
     * This function does a rudimentary analysis of the alpha data we're getting to see if it appears to be in
     * low dynamic range. At first, we just checked for the minimum and maximum values thus found, and as soon
     * as we found a pixel with value 0 and a pixel with value 255, we could bail, assuming full range. however
     * in practice it turns out that even low dynamic range video will have a few random high range pixles as
     * noise. So instead, we  do a statistical guesstimate. 'over239threshold' is the minimum number of pixels
     * (calculated as a fraction of the total pixels) such that if the count of pixels with a alue over 239
     * exceed the threshhold, we assume the data is in low dynamic range mode and needs a contrast stretch to
     * correct it.
     *
     * Once rangeModeConfirmed becomes true, we stop performing this expensive test, even if a new video is
     * loaded. We call it true when we've confirmed we're definitely not in low dyanmic range mode once, or if
     * we've found we do the test 10 times and it still comes up low range.
     */
    testDynamicRange(alphaData) {
        if (!this.rangeModeConfirmed) {
            let over239Count = 0;
            const over239threshold = Math.floor(alphaData.length * 0.0005);
            for (let i = 3, len = alphaData.length; i < len; i = i + 4) {
                const datum = alphaData[i - 1];
                if (datum > 239) {
                    over239Count++;
                }
                if (over239Count > over239threshold) {
                    this.rangeModeConfirmed = true;
                    this.lowDynamicRange = false;
                    break;
                }
            }
            this.lowDynamicRange = true;
            this.rangeOffset = 16;
            this.rangeStretch = 255 / (235 - 16);

            this.rangeTestCount++;
            if (this.rangeTestCount > 10) {
                this.rangeModeConfirmed = true;
            }
        }
    }

    /**
     * Every 4th slot in the image data array is for alpha values. Grab those from the alphaData array.
     * The alpha data array is a grayscale video, so you can grab any of the 3 'color' pixel values to
     * take as the alpha data value to use. Apply a contrast stretch if the video card is in low dynamic
     * range mode.
     */
    renderFrame(imageData, alphaData, image) {
        for (let i = 3, len = imageData.length; i < len; i = i + 4) {
            let alphaDatum = alphaData[i - 1];
            if (this.lowDynamicRange) {
                alphaDatum = (alphaDatum - this.rangeOffset) * this.rangeStretch;
            }
            imageData[i] = alphaDatum;
        }
        this.output.putImageData(image, 0, 0, 0, 0, this.outputWidth, this.outputHeight);

        const nextTime = new Date().getTime();
        const delta = nextTime - this.lastRenderTime;
        this.rewardAnimationsService.frameDelta = delta;
        this.lastRenderTime = nextTime;

        this.processingFrame = false;
    }

    /**
     * Frames are rendered by drawing the current image from the video to the buffer. Then we draw the top half
     * (color data) of the video to the output canvas. Then we grab the bottom half of the buffer image (alpha
     * data) and iterate over each pixel (in renderFrame()) in the output canvas, assigining the alpha values
     * as we go. Before rendering a frame we need to test the dynamic range of the video hardware we are in.
     */
    processFrame() {
        if (!this.metadataLoaded) {
            console.log('processFrame, metadataLoaded false, bailing');
            this.processNext();
            return;
        }
        if (this.processingFrame) {
            console.log('frame pileup!');
            this.processNext();
            return;
        }
        if (!this.playingVideo) {
            console.log('late call to processFrame');
            return;
        }
        this.processingFrame = true;
        try {
            this.buffer.drawImage(this.videoEl, 0, 0, this.outputWidth, this.outputHeight * 2, 0, 0, this.outputWidth, this.outputHeight * 2);
            const image = this.buffer.getImageData(0, 0, this.outputWidth, this.outputHeight);
            const imageData = image.data;
            const alphaData = this.buffer.getImageData(0, this.outputHeight, this.outputWidth, this.outputHeight).data;
            this.renderFrame(imageData, alphaData, image);
            this.processNext();
        } catch (e) {
            if (e.name === 'NS_ERROR_NOT_AVAILABLE') {
                setTimeout(() => {
                    this.retryCount++;
                    if (this.retryCount < 100) {
                        console.log('NS_ERROR_NOT_AVAILABLE, re-trying');
                    } else {
                        console.log('NS_ERROR_NOT_AVAILABLE, bailing...');
                        this.videoEnded();
                    }
                }, 100);
            } else {
                console.log('error processing frame: ', e);
                this.processNext();
            }
        }
    }

    processNext() {
        if (this.playingVideo) {
            if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
                this.videoEl.requestVideoFrameCallback(this.processFrame.bind(this));
            } else {
                requestAnimationFrame(this.processFrame.bind(this));
            }
        }
    }

    /**
     * The <video> itself is hidden, we render it to the output canvas by calling processFrame() periodically
     */
    playOutputVideo() {
        this.processFrame();
    }

    handleText() {
        this.playingText = true;
        const rewardTextContainer = this.rewardTextContainerRef.nativeElement;
        const rewardTextInnerContainer = this.rewardTextInnerContainerRef.nativeElement;
        if (this.currentAnimation.name === 'birthday_custom') {
            this.renderer.setAttribute(rewardTextContainer, 'class', 'birthdayTextContainer');
            this.renderer.setAttribute(rewardTextInnerContainer, 'class', '');
        } else {
            this.renderer.setAttribute(rewardTextContainer, 'class', 'rewardContainer');
            this.renderer.setAttribute(rewardTextInnerContainer, 'class', 'rewardInnerContainer');
        }
        this.renderer.setProperty(this.rewardText, 'innerText', this.currentAnimation.message);
        const rainbowColor = rainbowColors[Math.floor((Math.random() * rainbowColors.length))];
        this.renderer.setStyle(this.rewardText, 'color', rainbowColor);
        this.renderer.setStyle(this.rewardText, 'text-shadow', '1px 1px 2px black, 2px 2px 4px darkgray');
        this.renderer.appendChild(rewardTextInnerContainer, this.rewardText);

        const tl = new TimelineLite();
        tl.to(this.rewardText, 0.0, { scaleX: 0, scaleY: 0 });
        tl.to(this.rewardText, 1.5, { scaleX: 1.0, scaleY: 1.0, ease: Elastic.easeOut.config(3.0, 0.4) });
        tl.call(() => {
            if (this.currentAnimation.name === 'empty') {
                this.videoEnded();
            }
        });
        tl.play();
    }

    handleGif(gifPath) {
        this.playingGif = true;
        this.prefade();
        this.gifPath = gifPath;
        setTimeout(() => {
            this.gifPath = '';
            this.videoEnded();
        }, 5000);
    }

    handleVideo() {
        this.prefade();
        if (this.currentAnimation.name === 'pig') {
            console.log('Music: http://www.bensound.com/royalty-free-music');
        }

        this.mp4Path = this.getVideoPath('mp4Path');
        this.webmPath =  this.getVideoPath('webmPath');
        this.playingVideo = true;

        // If after 10 seconds the video metadata have not loaded, bail out. This prevents the UI
        // from getting stuck in a state of waiting for a video complete that is never going to.
        // This addresses an issue in Chrome where the loadedmetadata callback never happens if
        // the browser window is in the background. It also addresses potential network problems.
        this.videoMetadataTimeout = setTimeout(() => {
            if (!this.metadataLoaded) {
                this.videoEnded();
            }
        }, 10000);

        // no matter what, if the video is not done after 12 seconds, bail out
        this.videoFallbackTimeout = setTimeout(() => {
            if (this.playingVideo) {
                this.videoEnded();
            }
        }, 12000);
    }

    // if in 'normal' mode (whiteboard/activities showing, subdue the whiteboard content a bit with
    // a translucent white background to the animation)
    prefade() {
        if (this.firebaseAppModel.app.layoutMode === 'compact') {
            TweenLite.to(
                this.rewardAnimationRef.nativeElement,
                0.5,
                { 'background-color': 'rgba(255, 255, 255, 0.80)' });
        }
    }
}
