import { debounce } from 'lodash';
import * as PDFJS from 'pdfjs-dist';

function pdfViewerDirective($log, $timeout, $q, activityModel, firebaseAppModel, currentUserModel) {
    return {
        restrict: 'E',
        template: require('./pdf-viewer.directive.html'),

        link: ($scope, element) => {
            const DEFAULT_PAGE_NUM = 1;
            const DEFAULT_ROTATION_DEG = 0;
            const DEFAULT_MODE = 1;

            const DEFAULT_SCALE = 1.0;
            const DEFAULT_SCROLL_X = 0;
            const DEFAULT_SCROLL_Y = 0;
            let currentPageRotation = 0;
            const SINGLE_PAGE_MODE = 1;
            const DBL_PAGE_EVEN_MODE = 2;
            const DBL_PAGE_ODD_MODE = 3;
            const pageRotations = {};

            const holder = element.find('.pdf-holder');
            const body = angular.element('.workspace');

            let canvas = element.find('canvas');
            let currentPage; // initialized in FB CB
            let pdf = null;
            let scale; // initialized in FB CB
            let scrollXPercent = 0; // initialized in FB CB
            let scrollYPercent = 0; // initialized in FB CB
            const scrollOffset = {
                x: null,
                y: null,
            };
            let totalPages = null;
            const boundingEl = angular.element('.aspect-ratio-constriction');
            const w = boundingEl.length ? boundingEl : angular.element('.activity-holder');
            let updatingScrollFromFb = false;
            $scope.loading = false;
            $scope.bookMode = SINGLE_PAGE_MODE;
            $scope.soloPage = false;

            function setHolderHeight() {
                holder.height(w.height());
                holder.width(w.width());
            }
            function loadPDF(url) {
                $scope.loading = true;
                try {
                    PDFJS.getDocument(url).then(
                        (loaded_pdf) => {
                            totalPages = loaded_pdf.pdfInfo.numPages;
                            pdf = loaded_pdf;
                            loadState();
                        },
                        (error) => {
                            $log.debug('PDFJS Error while getting PDF document in PdfViewerDirective:', error);
                        },
                    ).catch(e => { 
                        $log.debug('PDFJS load error in PdfViewerDirective: ', e); 
                    });
                } catch (exc) {
                    $log.debug('PDFJS load error in PdfViewerDirective: ', exc); 
                }
            }

            function onMouseMove(event) {
                const deltaY = scrollOffset.y - event.clientY;
                const deltaX = scrollOffset.x - event.clientX;

                positionPage(deltaX, deltaY);
                saveScrollPosition();

                $timeout();
            }

            function onMouseUp() {
                holder.off('mousemove', onMouseMove);
                holder.off('mouseup', onMouseUp);

                scrollOffset.x = null;
                scrollOffset.y = null;

                $timeout();
            }

            $scope.onMouseDown = (event) => {
                if (!currentUserModel.user.isInGroup('student')) {
                    holder.on('mousemove', onMouseMove);
                    holder.on('mouseup', onMouseUp);

                    scrollOffset.y = holder.scrollTop() + event.clientY;
                    scrollOffset.x = holder.scrollLeft() + event.clientX;
                }
            };

            // Zooming
            $scope.zoomIn = () =>
                !$scope.loading && $scope.setScale(scale * 1.1);

            $scope.zoomOut = () =>
                !$scope.loading && $scope.setScale(scale * 0.9);

            $scope.setScale = s =>
                activityModel.getSessionRef().child(fbScalePath()).set(isNaN(s) ? 1.0 : s);

            $scope.rotate90 = degree =>
                activityModel.getSessionRef().child(fbPageRotationPath()).update(degree);

            // Page Changing
            $scope.next = () =>
                !$scope.loading && currentPage < totalPages - 1 && $scope.gotoPage(currentPage + 1);

            $scope.prev = () =>
                !$scope.loading && currentPage > 1 && $scope.gotoPage(currentPage - 1);

            $scope.setMode = (mode) => {
                activityModel.getSessionRef()
                    .child(fbModePath())
                    .set(mode);
            };

            $scope.gotoPage = (pageNum) => {
                activityModel.getSessionRef()
                    .child(fbPageNumPath())
                    .set(pageNum);
            };

            /**
             * Determines the percentage scroll of the page with 0 being scrolled to the top
             * of the page and 100% being scrolled to the bottom of the page. If no scrolling
             * is present, returns 0;
             * @param  {[type]} x [description]
             * @return {[type]}   [description]
             */
            function calculatePagePercentY() {
                return holder.scrollTop() / canvas.height();
            }

            function calculatePagePercentX() {
                return holder.scrollLeft() / canvas.width();
            }

            function saveScrollPosition() {
                if (activityModel.share && !updatingScrollFromFb) {
                    scrollYPercent = calculatePagePercentY();
                    scrollXPercent = calculatePagePercentX();

                    activityModel.getSessionRef().child(fbScrollXPercentPath()).set(scrollXPercent);
                    activityModel.getSessionRef().child(fbScrollYPercentPath()).set(scrollYPercent);
                }
                updatingScrollFromFb = false;
            }

            const scrollPage = debounce(e => saveScrollPosition(), 20);

            function calcScale(pdfW, pdfH, containerW, containerH, newScale) {
                let scaleX;
                let scaleY;

                if (pdfW < containerW && pdfH < containerH) {
                    scaleX = containerW / pdfW;
                    scaleY = containerH / pdfH;
                    newScale = Math.min(scaleX, scaleY) * scale;
                } else if (pdfW > containerW && pdfH > containerH) {
                    scaleX = containerW / pdfW;
                    scaleY = containerH / pdfH;
                    newScale = Math.min(scaleX, scaleY) * scale;
                } else if (pdfW < containerW && pdfH > containerH) {
                    // it's taller than the container, make the height smaller
                    scaleY = containerH / pdfH;
                    newScale = scaleY * scale;
                } else if (pdfW > containerW && pdfH < containerH) {
                    // it's wider than the container, make it narrower
                    scaleX = containerW / pdfW;
                    newScale = scaleX * scale;
                }
                return newScale;
            }

            function positionPageX(x) {
                holder.scrollLeft(x);
            }

            function positionPageY(y) {
                holder.scrollTop(y);
            }

            function positionPage(x, y) {
                positionPageX(x);
                positionPageY(y);
            }

            function positionPageXFromPercentage(xPercent) {
                positionPageX(xPercent * canvas.width());
            }

            function positionPageYFromPercentage(yPercent) {
                positionPageY(yPercent * canvas.height());
            }

            function positionPageFromPercentage(xPercent, yPercent) {
                positionPageXFromPercentage(xPercent);
                positionPageYFromPercentage(yPercent);
            }

            function render(pageNum, scaleFactor, rotation, xPercent = scrollXPercent, yPercent = scrollYPercent) {
                // if(pagesRendering.indexOf(pageNum) > 0){
                //    return;
                // }
                // pagesRendering.push(pageNum);

                setHolderHeight();
                if (pageNum === totalPages || (pageNum === 1 && $scope.bookMode === DBL_PAGE_EVEN_MODE)) {
                    $scope.soloPage = true;
                } else {
                    $scope.soloPage = false;
                }

                if ($scope.bookMode === SINGLE_PAGE_MODE || $scope.soloPage) {
                    return renderSingle(pageNum, scaleFactor, rotation, xPercent, yPercent);
                }

                return renderDouble(pageNum, scaleFactor, rotation, xPercent, yPercent);
            }

            function renderSingle(pageNum, scaleFactor, rotation,
                                  xPercent = scrollXPercent, yPercent = scrollYPercent) {
                if ($scope.renderTask) {
                    $scope.renderTask.cancel();
                }

                pageNum = pageNum || currentPage;
                scale = scaleFactor || scale;

                if (rotation !== undefined && Number.isInteger(rotation)) {
                    currentPageRotation = rotation;
                }

                $scope.currentlyRenderingNum = pageNum;

                return pdf && pdf.getPage(pageNum).then((page) => {
                    if ($scope.currentlyRenderingNum !== pageNum) {
                        return;
                    }

                    $scope.rendering = true;
                        // Assign here in case getPage fails.
                    currentPage = pageNum;

                    let viewport = page.getViewport(1.0, currentPageRotation);
                    const viewportScale = calcScale(viewport.width, viewport.height, holder.width(), holder.height(),
                                                    scale);

                    viewport = page.getViewport(viewportScale, currentPageRotation);
                    canvas = element.find('.pdf-holder-canvas');
                    const canvasWidth = 0.99 * viewport.width;
                    let canvasHeight = 0.99 * viewport.height;

                    if (scaleFactor === 1) {
                        // suck in the height by 10 or scrollbars appear prematurely
                        canvasHeight -= 10;
                    } 
                    canvas.attr('width', canvasWidth);
                    canvas.attr('height', canvasHeight);

                    $('.pageHolder').width('100%');
                    $('.pageHolder').height('100%');

                    let pageTop;
                    if (viewport.height > viewport.width) {
                        pageTop = Math.max((w.height() - viewport.height) / 2, 0);
                    } else {
                        pageTop = Math.max((w.height() - viewport.width) / 2, 0);
                    }

                    $('.pageHolder').css('top', pageTop);

                    const context = canvas[0].getContext('2d');

                    // render the page to an offscreen canvas first, then copy the complete rendered raster
                    // with drawImage, to avoid partial render errors from complex PDFs
                    const offscreenCanvas = element.find('.pdf-offscreen');
                    offscreenCanvas[0].width = canvasWidth;
                    offscreenCanvas[0].height = canvasHeight;
                    const offscreenCanvasContext = offscreenCanvas[0].getContext('2d');
                    offscreenCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

                    const renderContext = {
                        viewport,
                        canvasContext: offscreenCanvasContext,
                    };

                    $timeout();
                    $scope.renderTask = page.render(renderContext);

                    return $scope.renderTask.promise.then(() => {
                        if (offscreenCanvas[0].width > 0 && offscreenCanvas[0].height > 0) {
                            context.drawImage(offscreenCanvas[0], 0, 0);
                        }
                        $scope.loading = false;
                        positionPageFromPercentage(xPercent, yPercent);

                        $timeout();
                        $scope.rendering = false;
                    },                                    (error) => {
                        $log.warn(error);
                    });
                },                                      (err) => {
                    $log.debug('Error retreiving PDF page', err);
                }).catch(e => { 
                    $log.debug('PDFJS getPage error in PdfViewerDirective: ', e); 
                });
            }

            function renderDouble(pageNum, scaleFactor, rotation,
                                  xPercent = scrollXPercent, yPercent = scrollYPercent) {

                if ($scope.renderTask) {
                    $scope.renderTask.cancel();
                }

                pageNum = pageNum || currentPage;
                scale = scaleFactor || scale;

                if (rotation !== undefined && Number.isInteger(rotation)) {
                    currentPageRotation = rotation;
                }

                $scope.currentlyRenderingNum = pageNum;

                return pdf && pdf.getPage(pageNum).then((page) => {
                    if ($scope.currentlyRenderingNum !== pageNum) {
                        return;
                    }
                    $scope.rendering = true;

                        // Assign here in case getPage fails.
                    currentPage = pageNum;

                    let viewport = page.getViewport(1.0, currentPageRotation);
                    let viewportScale;

                    viewportScale = calcScale(viewport.width, viewport.height,
                                              holder.width() / 2, holder.height(), scale);

                    return pdf & pdf.getPage(pageNum + 1).then((page2) => {

                                // Assign here in case getPage fails.
                        currentPage = pageNum;

                        let rotationDeg;
                        if (pageRotations) {
                            rotationDeg = Object.keys(pageRotations).find(pageToRotate =>
                                        parseInt(pageToRotate.slice(4), 10) === (pageNum + 1),
                                    );

                            rotationDeg = pageRotations[rotationDeg];
                        }

                        if (!rotationDeg) {
                            rotationDeg = 0;
                        }

                        let viewport2 = page2.getViewport(1.0, rotationDeg);
                        let viewportScale2;

                        viewportScale2 = calcScale(viewport2.width, viewport2.height,
                                                   holder.width() / 2, holder.height(), scale);

                        const trueViewportScale = Math.min(viewportScale, viewportScale2);

                                /////page 1 ////
                        viewport = page.getViewport(trueViewportScale, currentPageRotation);
                        canvas = element.find('.pdf-holder-canvas');
                        const canvasWidth = 0.99 * viewport.width;
                        const canvasHeight = 0.99 * viewport.height;
                        canvas.attr('width', canvasWidth);
                        canvas.attr('height', canvasHeight);

                        const context = canvas[0].getContext('2d');


                        // render the page to an offscreen canvas first, then copy the complete rendered raster
                        // with drawImage, to avoid partial render errors from complex PDFs
                        const offscreenCanvas = element.find('.pdf-offscreen');
                        offscreenCanvas[0].width = canvasWidth;
                        offscreenCanvas[0].height = canvasHeight;
                        const offscreenCanvasContext = offscreenCanvas[0].getContext('2d');
                        offscreenCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

                        const renderContext = {
                            viewport,
                            canvasContext: offscreenCanvasContext,
                        };
                        $scope.renderTask = page.render(renderContext).then( () => {
                            if (offscreenCanvas[0].width > 0 && offscreenCanvas[0].height > 0) {
                                context.drawImage(offscreenCanvas[0], 0, 0);
                            }
                        });
                        $timeout();
                                ////end page 1/////

                                // page2//
                        viewport2 = page2.getViewport(trueViewportScale, rotationDeg);
                        const canvas2 = element.find('.page2-canvas');
                        canvas2.attr('width', 0.99 * viewport2.width);
                        canvas2.attr('height', 0.99 * viewport2.height);

                        $('.pageHolder').width(holder.width() * scale);

                        const delta = Math.max(viewport2.height, viewport2.width);
                        const pageTop = Math.max((w.height() - delta) / 2, 0);
                        $('.pageHolder').css('top', pageTop);

                        const context2 = canvas2[0].getContext('2d');


                        // render the page to an offscreen canvas first, then copy the complete rendered raster
                        // with drawImage, to avoid partial render errors from complex PDFs
                        const offscreenCanvas2 = element.find('.pdf-offscreen-2');
                        offscreenCanvas2[0].width = canvasWidth;
                        offscreenCanvas2[0].height = canvasHeight;
                        const offscreenCanvasContext2 = offscreenCanvas2[0].getContext('2d');
                        offscreenCanvasContext2.clearRect(0, 0, canvasWidth, canvasHeight);

                        const renderContext2 = {
                            canvasContext: offscreenCanvasContext2,
                            viewport: viewport2,
                        };
                        $timeout();
                        $scope.renderTask = page2.render(renderContext2);
                                // end page2 //

                        return $scope.renderTask.promise.then(() => {
                            context2.drawImage(offscreenCanvas2[0], 0, 0);
                            $scope.loading = false;
                            positionPageFromPercentage(xPercent, yPercent);

                            $timeout();
                            $scope.rendering = false;
                        },                                    (error) => {
                            $log.warn(error);
                        });
                    },                                         (err) => {
                        $log.debug('Error retreiving PDF page', err);
                    });
                }).catch(e => { 
                    $log.debug('PDFJS getPage error in PdfViewerDirective: ', e); 
                });
            }

            function fbPageNumPath() {
                return 'pageNum';
            }

            function fbModePath() {
                return 'bookMode';
            }

            function fbScalePath() {
                return 'scale';
            }

            function fbPageRotationPath() {
                return 'pageRotation';
            }

            function fbScrollXPercentPath() {
                return 'scrollXPercent';
            }

            function fbScrollYPercentPath() {
                return 'scrollYPercent';
            }

            function getValueFromSnap(snap, key, defaultValue) {
                const val = snap.val();
                let newVal = val || defaultValue;

                if (val !== null && typeof val === 'object') {
                    newVal = val[key];
                }

                return newVal || defaultValue;
            }

            function getPageRotationFromSnap(snap, pageNum) {
                const newPageRotations = getValueFromSnap(snap, fbPageRotationPath(), DEFAULT_ROTATION_DEG);
                const existingRotationPage = Object.keys(newPageRotations).find((pageToRotate) => {
                    const nextPageNum = parseInt(pageToRotate.slice(4), 10);
                    return nextPageNum === pageNum;
                });

                if (existingRotationPage) {
                    return newPageRotations[existingRotationPage];
                }

                return DEFAULT_ROTATION_DEG;
            }

            function getPageNumFromSnap(snap) {
                return getValueFromSnap(snap, fbPageNumPath(), DEFAULT_PAGE_NUM);
            }

            function getModeFromSnap(snap) {
                return getValueFromSnap(snap, fbModePath(), DEFAULT_MODE);
            }

            function getScaleFromSnap(snap) {
                return getValueFromSnap(snap, fbScalePath(), DEFAULT_SCALE);
            }

            function getScrollXFromSnap(snap) {
                scrollXPercent = getValueFromSnap(snap, fbScrollXPercentPath(), DEFAULT_SCROLL_X);
                return scrollXPercent;
            }

            function getScrollYFromSnap(snap) {
                scrollYPercent = getValueFromSnap(snap, fbScrollYPercentPath(), DEFAULT_SCROLL_Y);
                return scrollYPercent;
            }

            function handleActivityError(error) {
                $scope.loading = false;
                $log.debug('[PdfViewerDirective] activity ref load error:', error.code);
            }

            function loadState() {
                const deferScrollX = $q.defer();
                const deferScrollY = $q.defer();
                const deferPage = $q.defer();

                activityModel.getSessionRef().on('value', (snap) => {
                    let newPage = getPageNumFromSnap(snap);
                    const newScale = getScaleFromSnap(snap);
                    const newRotation = getPageRotationFromSnap(snap, newPage);
                    const newMode = getModeFromSnap(snap);

                    if (newPage !== currentPage ||
                        newScale !== scale ||
                        newMode !== $scope.bookMode ||
                        newRotation !== currentPageRotation) {

                        if ($scope.bookMode !== newMode && newMode === DBL_PAGE_ODD_MODE && newPage % 2 !== 1) {
                            newPage = Math.min(newPage - 1, totalPages);
                        } else if ($scope.bookMode !== newMode && newMode === DBL_PAGE_EVEN_MODE && newPage % 2 !== 0) {
                            newPage = Math.max(newPage - 1, 1);
                        }

                        $scope.bookMode = newMode;
                        currentPage = newPage;
                        $timeout(() => {
                        });
                        try {
                            render(newPage, newScale, newRotation);
                        } catch (e) {
                            $log.debug('error rendering page: ', e);
                        }
                    }

                    deferPage.resolve();
                },                               err => handleActivityError(err));

                activityModel.getSessionRef().child(fbScrollXPercentPath()).on('value', (snap) => {
                    updatingScrollFromFb = true;

                    const xPercent = getScrollXFromSnap(snap);

                    positionPageXFromPercentage(xPercent);
                    $scope.loading = false;
                    deferScrollY.resolve();
                },                                                             err => handleActivityError(err));

                activityModel.getSessionRef().child(fbScrollYPercentPath()).on('value', (snap) => {
                    updatingScrollFromFb = true;

                    const yPercent = getScrollYFromSnap(snap);

                    positionPageYFromPercentage(yPercent);
                    $scope.loading = false;
                    deferScrollX.resolve();
                },                                                             err => handleActivityError(err));

                return $q.all([deferScrollX.promise, deferScrollY.promise, deferPage.promise]);
            }

            const resizeHandler = debounce(() => {
                $timeout(() => {
                    setHolderHeight();
                    render(currentPage, undefined, undefined);
                });
            },                               100, { trailing: true });

            function initialize() {
                const pdf_url = JSON.parse(activityModel.configModel.model.descriptor)['url'];

                loadPDF(pdf_url);

                holder.on('scroll', scrollPage);
                $scope.$watch(() => body.width(), resizeHandler);
                $scope.$watch(() => sessionStorage.getItem('activeDrawer'), resizeHandler);
                setHolderHeight();
                activityModel.channel.bind('prev', () => $scope.prev());
                activityModel.channel.bind('next', () => $scope.next());
                activityModel.channel.bind('rotate90', (trans, degree) => $scope.rotate90(degree));
                activityModel.channel.bind('zoom', (trans, newScale) => $scope.setScale(newScale));
                activityModel.channel.bind('gotoPage', (trans, newPage) => $scope.gotoPage(newPage));
                activityModel.channel.bind('switchMode', (trans, mode) => $scope.setMode(mode));

                $scope.$watch(() => firebaseAppModel.app.layoutMode, (newVal, oldVal) => {
                    if (newVal !== oldVal) {
                        $timeout(() => {
                            $scope.gotoPage(currentPage);
                        }, 400); // if we don't give some time after a fullscreen event for the drawer animation to complete, the PDF viewport may not be ready
                    }
                });

                // handle legacy flag
                $scope.$watch(() => firebaseAppModel.app.fullscreen, (newVal, oldVal) => {
                    if (newVal !== oldVal) {
                        $timeout(() => {
                            $scope.gotoPage(currentPage);
                        }, 400); // if we don't give some time after a fullscreen event for the drawer animation to complete, the PDF viewport may not be ready
                    }
                });

                // Block student scrolling.
                if (currentUserModel.user.isInGroup('student')) {
                    const ele = element.find('.pdf-holder')[0];
                    ele.style.overflowX = 'hidden';
                    ele.style.overflowY = 'hidden';
                }
            }

            activityModel.foundationLoaded.then(() => {
                initialize();
            },                                  (error) => {
                $log.warn(error);
            });
            $scope.$on('$destroy', () => {
                if (pdf) {
                    try {
                        pdf.destroy()
                    } catch(destroyError) {
                        $log.debug('destroy error: ', destroyError);
                    };
                    // pdf = null;
                }
            });
        },
    };
}

import * as angular from 'angular';

const pdfViewer = angular.module('toys').directive('pdfViewer', [
    '$log', '$timeout', '$q', 'activityModel', 'firebaseAppModel', 'currentUserModel',
    pdfViewerDirective,
]);
