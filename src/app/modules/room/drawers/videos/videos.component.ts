import * as $ from 'jquery';
class VideosController {
    static $inject = ['$log', '$q', '$scope', '$timeout', 'appModel', 'dispatcherService', 'rosterModelService',
        'firebaseAppModel', 'tokboxService', 'tokboxRecordService', 'pLConfirmDialogService', 'firebaseModel', 'currentUserModel',
    ];
    showProfileMenu: boolean;

    readonly PERSONA_HEIGHT = 144;
    readonly PERSONA_WIDTH = 192;

    readonly JUMBOTRON = 'wide';
    readonly GRID = 'grid';
    readonly COMPACT = 'normal';


    layoutMode = this.COMPACT;
    nextLayoutMode: any;
    lastLayoutMode: any;

    allPersonas: any;
    promotedPersonas: any;
    demotedPersonas: any;

    readonly ANIM_TIME = 500;

    updatingLayout = false;
    queueUpdateLayout = false;
    showConfirmReset = false;
    isClinician: any;

    constructor(private $log, private $q, private $scope, private $timeout, private appModel, private dispatcherService,
                private rosterModel, private firebaseAppModel, private tokboxService, private tokboxRecordService,
                private pLConfirmDialogService, 
                private firebaseModel,
                currentUserModel) {
        this.nextLayoutMode = firebaseAppModel.app.fullscreen;
        this.showProfileMenu = false;
        this.lastLayoutMode = this.JUMBOTRON;

        rosterModel.addPersonaListener(this);

        this.setupWatchers();

        this.isClinician = currentUserModel.user.isClinicianOrExternalProvider();
    }

    refreshTokbox(clientIDs, archiveId) {
        this.pLConfirmDialogService.show({
            header: 'Reset Video Connection',
            content: `<div>
                        Are you sure you want to reset your video connection?
                    </div>`,

            primaryLabel: `Yes`,
            secondaryLabel: 'No',
            primaryCallback: () => {
                this.confirmRefresh()
            },
            secondaryCallback: () => {
            },
            closeCallback: () => {
            },
        });
    }
    confirmRefresh = () => {
        this.rosterModel.reset();
    }

    setMouseMuted = (value) => {
        this.firebaseAppModel.setMouseMuted(value);
    }

    toggleSharedCursor = () => {
        if (!this.firebaseAppModel.app.sharedCursorToggleDisabled) {
            this.firebaseAppModel.setSharedCursorOn(!this.firebaseAppModel.app.sharedCursorOn);
        }
    }

    toggleBackgroundBlur = () => {
        this.appModel.app.backgroundBlurOn = !this.appModel.app.backgroundBlurOn;
    }

    toggleAudioLevels = () => {
        this.firebaseAppModel.setAudioLevelsOn(!this.firebaseAppModel.app.audioLevelsOn);
    }

    isFullScreenMode = () => this.firebaseAppModel.app.fullscreen !== this.COMPACT;

    // current number of demoted user columns is determined by the sum of their heights divided by the
    // height of the screen
    private getCurrentNumDemotedCols() {
        let totalDemotedPersonasHeight = 0;
        for (const persona of this.demotedPersonas) {
            totalDemotedPersonasHeight += persona.getActualHeight();
        }
        return Math.ceil(totalDemotedPersonasHeight / $('main').height());
    }

    // find the size to apply to promoted personas in jumbo mode
    private getJumboDimensions() {
        const count = this.promotedPersonas.length;

        if (count === 0) {
            return {
                xMargin: null,
                yMargin: null,
                width: 0,
                height: 0,
            };
        }

        const sidebarWidth = this.PERSONA_WIDTH * this.getCurrentNumDemotedCols();
        const fullWidth = $('main').width() - sidebarWidth;
        const fullHeight = $('main').height();

        const numCols = Math.ceil(Math.sqrt(count));
        const numRows = Math.ceil(count / numCols);

        let width = 0.95 * fullWidth / numCols;
        let height = 0.75 * width;

        if (height * numRows > fullHeight) {
            height = 0.95 * fullHeight / numRows;
            width = 1.33 * height;
        }

        // xMargin/yMargin are half of the leftover horizontal/vertical space, not margins of
        // individual personas.
        const xMargin = (fullWidth - width * numCols) / 2;
        const yMargin = (fullHeight - height * numRows) / 2;

        // if the width of a persona is to small, display its buttons in mini mode
        if (width < 450) {
            (<any>$('.control-btn')).addClass('mini-btn', 500);
        } else {
            (<any>$('.control-btn')).removeClass('mini-btn', 500);
        }

        return {
            xMargin,
            yMargin,
            width,
            height,
        };
    }

    // promoted personas are laid out in the jumobtron space as vertical, wrapping columns
    private layoutPromotedPersonas() {
        const deferred = this.$q.defer();

        if (!this.promotedPersonas || this.promotedPersonas.length === 0) {
            deferred.resolve();
        } else {
            const dimensions = this.getJumboDimensions();
            const mainHeight = $('main').height();
            const mainTop = $('main').position().top;

            let locY = mainTop + dimensions.yMargin;
            let locX = this.getCurrentNumDemotedCols() * this.PERSONA_WIDTH + dimensions.xMargin;
            let column = 0;

            for (let i = 0, l = this.promotedPersonas.length; i < l; i++) {
                const persona = this.promotedPersonas[i];
                persona.container.css('position', 'absolute');
                persona.animating = true;

                // check and see if this is going to push us past the height of the main element, if so,
                // wrap to the next column
                if ((locY + dimensions.height - mainTop) > mainHeight) {
                    locY = mainTop + dimensions.yMargin;
                    locX += dimensions.width;
                    column++;
                }

                // animate to the destination
                persona.container.animate(
                    {
                        top: locY,
                        left: locX,
                        width: dimensions.width,
                        height: dimensions.height,
                        padding: '5px',
                    },
                    {
                        duration: this.ANIM_TIME,
                        queue: false,
                        complete: () => {
                            persona.animating = false;
                            if (i === l - 1) {
                                // resolve this promise if we've finished animating the last one
                                deferred.resolve();
                            }
                        },
                    });
                // if not already bighead, update state
                if (!persona.bighead) {
                    persona.bighead = true;
                    persona.container.addClass('lg-vid', { duration: this.ANIM_TIME });
                }
                locY += dimensions.height;
            }
        }
        return deferred.promise;
    }

    // demoted personas are laid out in the sidebar space as vertical, wrapping columns
    private layoutDemotedPersonas() {
        const deferred = this.$q.defer();
        if (!this.demotedPersonas || this.demotedPersonas.length === 0) {
            deferred.resolve();
        } else {
            const mainTop = $('main').position().top;
            let locX = 0;
            let locY = mainTop;
            let column = 0;
            const mainHeight = $('main').height();
            for (let i = 0, l = this.demotedPersonas.length; i < l; i++) {
                const persona = this.demotedPersonas[i];
                persona.container.css('position', 'absolute');
                persona.animating = true;

                // shrink from bighead size back to video default size, if necessary
                if (persona.bighead) {
                    persona.bighead = false;
                    persona.container.animate(
                        {
                            height: this.PERSONA_HEIGHT,
                            width: this.PERSONA_WIDTH,
                            padding: '0px',
                        },
                        {
                            duration: this.ANIM_TIME,
                            complete: () => {
                                persona.container.removeClass('lg-vid');
                            },
                        });
                }

                // check and see if this is going to push us past the height of the main element, if so,
                // wrap to the next column
                const personaHeight = persona.getTheoreticalDemotedHeight();
                if (this.layoutMode !== this.COMPACT) {
                    if ((locY + personaHeight) > mainHeight) {
                        column++;
                        locX = column * this.PERSONA_WIDTH;
                        locY = mainTop;
                    }
                } else {
                    const newHeight = locY + personaHeight;
                    const oldHeight = $('main').height();
                    if (newHeight > oldHeight) {
                        $('main').height(newHeight);
                    }
                }

                // animate to the destination
                persona.container.animate(
                    {
                        left: locX,
                        top: locY,
                    },
                    {
                        duration: this.ANIM_TIME,
                        queue: false,
                        complete: () => {
                            persona.animating = false;
                            persona.container.removeClass('lg-vid');
                            if (i === l - 1) {
                                // resolve this promise if we've finished animating the last one
                                deferred.resolve();
                            }
                        },
                    });
                locY += personaHeight;
            }
        }
        return deferred.promise;
    }

    // In compact mode, switch position style to relative so that the scrollbar can appear if neccesary.
    // If the videos are going to make the scrollbar appear, make them narrower to make room for it.
    // this breaks the asspect ratio, but if we also shrink the height, it can then make the scrollbar
    // disappear again and we get an annoying flicker
    compactLayout() {
        let totalHeight = 0;
        this.allPersonas.forEach((persona) => {
            totalHeight += persona.getActualHeight();
        });
        const shrink = totalHeight > $('main').height();
        this.allPersonas.forEach((persona) => {
            persona.container.removeAttr('style');
            persona.container.css('position', 'relative');
            if (shrink) {
                persona.container.css('width', '172px');
            }
        });
    }

    // If in Jumbotron mode, layout demoted and promoted personas, finish when both layout promises have
    // resolved. If the last mode was Jumbotron mode, and the next mode is Compact, first animate everything
    // and then call compactLayout().
    // Otherwise, just call compactLayout.
    layout() {
        const deferred = this.$q.defer();
        if (this.layoutMode !== this.COMPACT || this.lastLayoutMode !== this.COMPACT) {
            const promises = [];
            promises.push(this.layoutDemotedPersonas());
            promises.push(this.layoutPromotedPersonas());
            this.$q.all(promises).then(() => {
                if (this.layoutMode === this.COMPACT) {
                    this.compactLayout();
                }
                deferred.resolve();
            });
        } else {
            this.compactLayout();
            deferred.resolve();
        }

        return deferred.promise;
    }

    eqSet(as, bs) {
        if (as.size !== bs.size) { return false; }
        for (const a of as) {
            if (!bs.has(a)) { return false; }
        }
        return true;
    }

    updatePersonaList() {
        const localPersonas = [this.rosterModel.localPersona];
        if (this.rosterModel.localPersona2) {
            localPersonas.push(this.rosterModel.localPersona2);
        }
        if (this.rosterModel.screenshare) {
            localPersonas.push(this.rosterModel.screenshare);
        }

        // all personas is everyone in rosterModel's personas array, plus any locals
        this.allPersonas = localPersonas
            .concat(this.rosterModel.personas, this.rosterModel.waitingPersonas)
            .filter(x => !!x);
        this.promotedPersonas = [];
        this.demotedPersonas = [];

        // if there are promoted personas, find out who they are and add to promoted personas list
        if (this.firebaseAppModel.app.promotedPersonas) {
            this.allPersonas.forEach((persona) => {
                if (this.firebaseAppModel.app.promotedPersonas.hasOwnProperty(persona.guid)) {
                    persona.promoted = true;
                    this.promotedPersonas.push(persona);
                } else {
                    persona.promoted = false;
                    this.demotedPersonas.push(persona);
                }
            });
        } else {  // otherwise, everyone is demoted
            this.allPersonas.forEach((persona) => {
                persona.promoted = false;
                this.demotedPersonas.push(persona);
            });
        }
    }

    // begin layout functions
    updateLayout = (reason) => {
        // if already in progress with a previous layout, set a flag to queue another layout later and return
        if (this.updatingLayout) {
            this.queueUpdateLayout = true;
        } else {

            // don't update persona list to next promotion sets until we are definitely in the next layout
            // cycle, otherwise you step on existing animations partway through
            this.updatePersonaList();

            // check to ensure all personas have container elements
            for (let i = 0, l = this.allPersonas.length; i < l; i++) {
                const persona = this.allPersonas[i];
                // if the container for a persona does not yet exist, the PersonaDirective link functions have
                // not all run, we need to wait and try updateLayout again later
                if (!persona.container) {
                    this.$log.warn('not ready for updateLayout, will try again...');
                    this.$timeout(this.updateLayout, 50);
                    return;
                }
            }

            // likewise, don't change this.layoutMode to the next needed mode until we are definitely in the
            // next layout cycle, otherwise you step on existing animations partway through
            this.layoutMode = this.nextLayoutMode;
            this.updatingLayout = true;

            // if switching from COMPACT to JUMBOTRON, wait a bit for the drawer to slide all the way open
            let wait = 50;
            if (this.layoutMode !== this.COMPACT && this.lastLayoutMode === this.COMPACT) {
                wait = 350;
            }

            this.$timeout(() => {
                this.layout().then(
                    () => {
                        // if we need a follow-up layout update because some change happened while the last layout
                        // animations were in progress, call updateLayout() again in 100ms
                        if (this.queueUpdateLayout) {
                            this.$timeout(
                                () => {
                                    this.queueUpdateLayout = false;
                                    this.updatingLayout = false;
                                    this.lastLayoutMode = this.layoutMode;
                                    this.updateLayout('queued');
                                },
                                500,
                            );
                        } else {
                            this.lastLayoutMode = this.layoutMode;
                            this.updatingLayout = false;
                        }
                    });
            },
                          wait,
            );
        }
    }

    // what follows are a variety of events that can trigger layout updates, inluding: resizing, drawer
    // opening/closing animation ended, fullscreen mode change, promotion changes, persona count changes,
    // and an individual persona changed

    setupWatchers() {
        $(window).on('resize', () => this.updateLayout('window resize'));

        $('.drawer-videos').on(
            'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            () => this.updateLayout('drawer animation end'),
        );

        // TODO - convert these $watch's to $onChanges() and firebaseAppModel.app.X bindings

        // track the previous fullscreen mode when it changes
        this.$scope.$watch(() => this.firebaseAppModel.app.fullscreen, (newVal, oldVal) => {
            if (newVal !== oldVal) {
                const mode = newVal;
                this.nextLayoutMode = mode;
                this.updateLayout('new mode: ' + newVal);

                // Sometimes the 'lg-vid' is not removed, so force remove it.
                if (mode === 'normal') {
                    setTimeout(() => {
                        this.allPersonas.forEach((persona) => {
                            persona.container.removeClass('lg-vid');
                        });
                    }, 500);
                }
            }
        });
        // track the promoted personas
        this.$scope.$watch(() => this.firebaseAppModel.app.promotedPersonas, (newVal, oldVal) => {
            // if both exist but are equal, return without updating
            if (newVal && oldVal) {
                // promotedPersonas is an object where the keys are persona guids and the values
                // are always false. Firebase prefers this to arrays. To determine if they are equal
                // (and therefore no update is needed) treat them as two Sets, and see if the Sets
                // contain the same items
                const newSet = new Set(Object.keys(newVal));
                const oldSet = new Set(Object.keys(oldVal));
                if (this.eqSet(newSet, oldSet)) {
                    return;
                }
            }

            // if both are null, return without updating
            if (!newVal && !oldVal) {
                return;
            }

            this.$timeout(() => {
                this.updateLayout('promotion change');
            },            50);
        },                 true);

        const personaCount = () => {
            let count = this.rosterModel.personas.length + this.rosterModel.waitingPersonas + 1;
            if (this.rosterModel.localPersona2) {
                count++;
            }
            return count;
        };

        this.$scope.$watch(personaCount, () => {
            this.$timeout(() => {
                this.updateLayout('persona count');
            },            50);
        });

        this.dispatcherService.addListener('fullscreenChangeRequestEvent', null, (event, payload) => {
            this.setLayoutMode(payload);
        },                                 this);
    }

    personaUpdated = (persona) => {
        this.updateLayout('persona updated');
    }

    handleNewMode = (mode) => {
        if (mode === this.JUMBOTRON) {
            this.firebaseAppModel.setPromotedPersonas([this.rosterModel.localPersona.guid]);
        }
        // we now treat GRID mode as JUMBOTRON mode, except that when we enter GRID mode, promote
        // everyone
        if (mode === this.GRID) {
            const allGuids = [];
            this.allPersonas.forEach((persona) => {
                allGuids.push(persona.guid);
            });
            this.firebaseAppModel.setPromotedPersonas(allGuids);
        }
        if (mode === this.COMPACT) {
            this.firebaseAppModel.setPromotedPersonas([]);
        }
    }

    setLayoutMode = (mode) => {
        this.handleNewMode(mode);
        this.firebaseAppModel.setFullscreen(mode);
        this.dispatcherService.dispatch('fullscreenChangedEvent', null, mode);
    }

}

export default VideosController;

import { videosModule } from './videos.module';

const videosComponent = videosModule.component('videos', {
    template: require('./videos.component.html'),
    bindings: {
    },
    controller: VideosController,
});
