import * as PDFJS from 'pdfjs-dist';
import * as angular from 'angular';
import { debounce, each, isUndefined } from 'lodash';

/**
 * AssessmentPDFContentDirective controls the loading and rendering of assessment pdf's
 */
const AssessmentPDFContentDirective = function ($log,
                                                $q,
                                                $window,
                                                $timeout,
                                                $stateParams,
                                                AssessmentModel,
                                                dispatcherService,
                                                guidService,
                                                firebaseAppModel) {
    return {
        restrict: 'E',
        template: require('./assessment-pdf-content.directive.html'),
        link: ($scope, element, attrs) => {
            let ready = false;
            let visibilityHandler = false;
            const UUID = guidService.generateUUID();
            const pdfHolderClass = '.pdf-holder';

            const resize = debounce(() => {

                render();
                if (AssessmentModel.channel) {
                    AssessmentModel.channel.call({
                        method: 'selectPage',
                        params: $scope.currentPage,
                    });
                }
            },                        666);
            angular.element($window).on('resize', resize);

            $scope.$watch(() => sessionStorage.getItem('activeDrawer'), resize);

            let scrollXPercent = 0; // initialized in FB CB
            let scrollYPercent = 0; // initialized in FB CB

            let holder = element.find(pdfHolderClass);

            const scrollOffset = {
                x: null,
                y: null,
            };

            let updatingScrollFromFb = false;

            function initialize() {
                const descriptor = JSON.parse(AssessmentModel.configModel.model.descriptor);

                const pdf_url = descriptor['url'];
                $scope.currentIndex = 1;

                const pages = descriptor['pages'];

                each(pages, (page) => {
                    $scope.studentPages.push(page.stimulus);
                    if (page.instructions !== undefined) {
                        $scope.isDoubleSided = true;
                        $scope.clinicianPages.push(page.instructions);
                    }
                });

                $scope.totalNumPages = $scope.studentPages.length;

                holder = element.find(pdfHolderClass);
                holder.on('scroll', scrollPage);

                loadPDF(pdf_url);
                // bind to methods
            }

            $scope.studentPages = [];
            $scope.clinicianPages = [];
            $scope.loading = false;
            $scope.currentZoom = 1.0;
            $scope.offsetX = 0.0;
            $scope.offsetY = 0.0;
            $scope.currentPage = 1;
            $scope.currentIndex = 0;
            $scope.totalNumPages = null;
            $scope.showInstructions = AssessmentModel.getDefaultShowInstructions();
            $scope.isDoubleSided = false;

            let canvas = element.find('canvas');
            let context = canvas[0].getContext('2d');
            let pdf = null;

            let instructionsPage = null;
            let instructionsLoading = false;
            const instructionCanvas = element.find('.instructionsCanvas');
            const instructionsContext = instructionCanvas[0].getContext('2d');

            const updateZoom = function (value) {
                $scope.currentZoom = value;

                if ($scope.options.currentPageObject) {
                    const viewport = $scope.options.currentPageObject.getViewport($scope.currentZoom);

                    $scope.holderWidth = viewport.width;
                    $scope.holderHeight = viewport.height - 10 * $scope.currentZoom;
                }

                if (AssessmentModel.share) {
                    AssessmentModel.saveZoom($scope.currentZoom);
                }
            };

            AssessmentModel.foundationLoaded.then(() => {
                initialize();
                setupDrawerCalls();
                AssessmentModel.channel.bind('changeZoomValue', (context1, params) => {
                    $scope.currentZoom = params[0];

                    if ($scope.currentZoom < 1.001) {
                        $scope.offsetX = 0;
                        $scope.offsetY = 0;

                        $timeout(() => {
                        });
                    }

                    if (AssessmentModel.share) {
                        AssessmentModel.saveZoom($scope.currentZoom);
                    }
                    $timeout(() => {
                        render();
                    });
                });
            }).catch((error) => {
                $log.debug('Error in changeZoomValue: ', error);
            });

            // hide the pdfview when we're in fullscreen mode. otherwise when the workspace z-index is elevated to
            // display the instructions overlay in fullscreen mode (ROOM-224), then PDF content displays as well. 
            $scope.hidePDFViewer = () => {
                if (firebaseAppModel) {
                    if (firebaseAppModel.app.layoutMode) {
                        return firebaseAppModel.app.layoutMode !== 'compact';
                    }
                    // handle legacy layout flag
                    return firebaseAppModel.app.fullscreen !== 'normal';
                } else {
                    return false;
                }
            }

            $scope.isDragged = false;
            $scope.onMouseMove = function (event) {
                if ($scope.isDragged) {
                    const deltaY = scrollOffset.y - event.clientY;
                    const deltaX = scrollOffset.x - event.clientX;
                    positionPage(deltaX, deltaY);
                    saveScrollPosition();
                    $timeout(() => {});
                }
            };

            $scope.onMouseUp = function () {

                if ($scope.isDragged) {
                    scrollOffset.x = null;
                    scrollOffset.y = null;
                    $timeout(() => {});
                    $scope.isDragged = false;
                }
            };

            $scope.contentOnMouseDown = function (event) {

                scrollOffset.y = holder.scrollTop() + event.clientY;
                scrollOffset.x = holder.scrollLeft() + event.clientX;
                $scope.isDragged = true;
            };

            $scope.setInstructionsVisible = function (value) {
                if (instructionsLoading) {
                    return;
                }
                $scope.showInstructions = value;
                if (pdf) {
                    if ($scope.showInstructions) {
                        const instructionsPageNum = $scope.clinicianPages[$scope.currentIndex];
                        if (instructionsPageNum) {
                            try {
                                pdf.getPage(instructionsPageNum).then((p) => {
                                    $log.debug('[AssessmentPDFContentDirective] retrieved instructions page');
                                    instructionsLoading = true;
                                    instructionsPage = p;
                                    $timeout(() => {
                                        renderInstructions();
                                    });
                                }).catch((error) => {
                                    $log.debug('[AssessmentPDFContentDirective] instructions getPage failed');
                                });
                            } catch (error) {
                                $log.debug('[AssessmentPDFContentDirective] instructions getPage failed');
                            }

                        }
                    } else {
                        updatePdfHolderOpacity(1.0);
                    }
                }
                $timeout(() => {}, 0);
            };

            function loadPDF(key) {
                $scope.secureUrl = AssessmentModel.getProtectedContentUrl(key).then((data) => {
                    const pdf_url = data.assets[key];
                    $scope.loadingTask = PDFJS.getDocument(pdf_url);
                    $scope.loadingTask.then((loaded_pdf) => {
                        pdf = loaded_pdf;
                        loadState().then(handleLoadComplete).catch((error) => {
                            $log.debug('Loading task error: ', error);
                        });
                    }).catch((error) => {
                        $log.debug('Loading task error: ', error);
                    });
                });
            }

            // Page Changing
            $scope.next = function () {
                if (!$scope.loading && $scope.currentIndex < $scope.totalNumPages - 1) {
                    $scope.currentIndex++;
                    $scope.currentPage = $scope.studentPages[$scope.currentIndex];
                    $scope.assessmentContentGoToPage($scope.currentPage);
                }
                return $scope.currentIndex;
            };

            $scope.jumpTo = function (pageRequest) {

                const newIndex = Math.min($scope.totalNumPages, pageRequest);
                $scope.currentIndex = Math.max(0, newIndex - 1);

                const newPage = $scope.studentPages[$scope.currentIndex];

                $scope.assessmentContentGoToPage(newPage);

                return $scope.currentIndex;
            };

            $scope.prev = function () {
                if (!$scope.loading && $scope.currentIndex > 0) {
                    $scope.currentIndex--;
                    $scope.currentPage = $scope.studentPages[$scope.currentIndex];
                    $scope.assessmentContentGoToPage($scope.currentPage);
                }

                return $scope.currentIndex;
            };

            $scope.assessmentContentGoToPage = function (pageNum) {

                if (AssessmentModel.share) {
                    AssessmentModel.savePage({
                        UUID,
                        currentPage: pageNum,
                    });
                    // when we switch pages, clear any existing scroll positions
                    AssessmentModel.saveScrollPosition(0, 0);
                }
                gotoPageLocal(pageNum);
            };

            function gotoPageLocal(pageNum) {
                $scope.currentPage = pageNum;
                $scope.currentIndex = $scope.studentPages.findIndex(x => x === $scope.currentPage);
                setLoading(true);
                const resolved = function (p) {
                    $scope.options.currentPageObject = p;
                    resize();
                };
                const rejected = function (error) {
                    $log.debug('[AssessmentPDFContentDirective] error going to pdf page (rejected)');
                };

                if (pdf) {
                    try {
                        pdf.getPage(pageNum).then(resolved, rejected).catch((error) => {
                            $log.debug('[AssessmentPDFContentDirective] gotoPageLocal error: ', error);
                        });
                    } catch (error) {
                        // if the pdf was destroyed (e.g. user left) after loading pdfjs will throw errors internally.
                    }
                }
            }

            function positionPageX(x) {
                holder = element.find(pdfHolderClass);
                holder.scrollLeft(x);
            }

            function positionPageY(y) {
                holder = element.find(pdfHolderClass);
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

            function calcScale(pdfW, pdfH, containerW, containerH, scale) {
                const scaleX = containerW / pdfW;
                const scaleY = containerH / pdfH;
                const newScale = Math.min(scaleX, scaleY) * scale;
                return newScale;
            }

            $scope.options = { currentPageObject: undefined };

            function visibilityRender() {
                if (document.hidden) {
                    return;
                }
                $timeout(() =>{
                    render();
                });
                visibilityHandler = false;
                document.removeEventListener('visibilitychange', visibilityRender, false);
            }

            function render() {
                if ($scope.rendering) {
                    $scope.scheduleReRender = true;
                    return;
                }
                if (isUndefined($scope.currentPage)
                    || !pdf
                    || isUndefined($scope.options.currentPageObject)) {
                    return;
                }

                if (document.hidden) {
                    if (!visibilityHandler) {
                        visibilityHandler = true;
                        document.addEventListener('visibilitychange', visibilityRender, false);
                    }
                    return;
                }
                $scope.rendering = true;
                const page = $scope.options.currentPageObject;

                if (!holder.length) {
                    holder = element.find(pdfHolderClass);
                }
                let viewport = page.getViewport(1);
                const viewportScale = calcScale(viewport.width,
                                                viewport.height,
                                                holder.width(),
                                                holder.height(),
                                                $scope.currentZoom);
                viewport = page.getViewport(viewportScale);

                const canvasWidth = viewport.width;
                const canvasHeight = viewport.height - 10 * $scope.currentZoom;;

                canvas = element.find('.pdf-holder-canvas');
                canvas[0].width = 0;
                canvas[0].width = canvasWidth;
                canvas[0].height = canvasHeight;
                context = canvas[0].getContext('2d');
                context.clearRect(0, 0, canvasWidth, canvasHeight);

                // render the page to an offscreen canvas first, then copy the complete rendered raster
                // with drawImage, to avoid partial render errors from complex PDFs
                const offscreenCanvas = element.find('.pdf-offscreen');
                offscreenCanvas[0].width = canvasWidth;
                offscreenCanvas[0].height = canvasHeight;
                const offscreenCanvasContext = offscreenCanvas[0].getContext('2d');
                offscreenCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

                const offscreenRenderContext = {
                    viewport,
                    canvasContext: offscreenCanvasContext,
                };

                try {
                    page.render(offscreenRenderContext).promise.then(() => {
                        $log.debug('[AssessmentPDFContentDirective] render complete?');

                        if (!$scope.scheduleReRender && offscreenCanvas[0].width > 0 && offscreenCanvas[0].height > 0) {
                            context.drawImage(offscreenCanvas[0], 0, 0);
                        }
                        $scope.rendering = false;
                        setLoading(false);
                        $timeout(() => {
                            $scope.deferPage.resolve();
                        });
                        if ($scope.scheduleReRender) {
                            $scope.scheduleReRender = false;
                            $timeout(() => {
                                render();
                            });
                        }
                    }).catch((error) => {
                        $log.debug('Assessment Page Render interruption error: ', error);
                    });
                } catch (e) {
                    $log.debug('Assessment Page Render interruption error: ', e);
                }

                $scope.setInstructionsVisible(AssessmentModel.getShowInstructions());
            }

            const instructionsHolder = element.find('.instructions-holder');

            function renderInstructions() {
                let viewport = instructionsPage.getViewport(1.0);

                const maxInstructionsWidth = instructionsHolder.width() - instructionCanvas[0].offsetLeft;

                const newScale = calcScale(viewport.width,
                                           viewport.height,
                                           maxInstructionsWidth,
                                           instructionsHolder.height(),
                                           1.0);
                viewport = instructionsPage.getViewport(newScale);

                if (viewport.width > maxInstructionsWidth) {
                    instructionCanvas.attr('width', maxInstructionsWidth);
                } else {
                    instructionCanvas.attr('width', viewport.width);
                }

                instructionCanvas.attr('height', viewport.height);

                const instructions = instructionsHolder[0];
                $(instructions).css('top', '0px');
                $(instructions).css('left', '0px');
                updateOpacity(AssessmentModel.getInstructionOpacity());

                // render the page to an offscreen canvas first, then copy the complete rendered raster
                // with drawImage, to avoid partial render errors from complex PDFs
                const offscreenCanvas = element.find('.offscreenInstructionsCanvas');
                offscreenCanvas[0].width = viewport.width;
                offscreenCanvas[0].height = viewport.height - 10 * $scope.currentZoom;
                const offscreenCanvasContext = offscreenCanvas[0].getContext('2d');

                const offscreenRenderContext = {
                    viewport,
                    canvasContext: offscreenCanvasContext,
                };

                try {
                    instructionsPage.render(offscreenRenderContext).promise.then(() => {
                        if (offscreenCanvas[0].width > 0 && offscreenCanvas[0].height > 0) {
                            instructionsContext.drawImage(offscreenCanvas[0], 0, 0);
                        }
                        setLoading(false);
                        instructionsLoading = false;
                        $timeout(() => {});
                    }).catch((error) => {
                        $log.debug('AssessmentPDFContentDirective error rendering instructions: ', error);
                    });
                } catch (err) {
                    $log.debug('AssessmentPDFContentDirective error rendering instructions: ', err);
                }
            }

            function calculatePagePercentY() {
                holder = element.find(pdfHolderClass);
                return holder.scrollTop() / canvas.height();
            }

            function calculatePagePercentX() {
                holder = element.find(pdfHolderClass);
                return holder.scrollLeft() / canvas.width();
            }

            function saveScrollPosition() {
                if (AssessmentModel.share && !updatingScrollFromFb) {

                    scrollYPercent = calculatePagePercentY();
                    scrollXPercent = calculatePagePercentX();
                    AssessmentModel.saveScrollPosition(scrollXPercent, scrollYPercent);
                }
                updatingScrollFromFb = false;
            }

            const scrollPage = debounce(
                (e) => {
                    saveScrollPosition();
                },
                20);

            function loadState() {

                $scope.deferScrollX = $q.defer();
                $scope.deferScrollY = $q.defer();
                $scope.deferPage = $q.defer();

                dispatcherService.addListener('pageChangeEvent', null, $scope.handlePageChange, this);
                if (AssessmentModel.canUserAccessInstructions()) {
                    dispatcherService.addListener('opacityChangeEvent', null, $scope.handleOpacityChange, this);
                    dispatcherService.addListener(
                        'instructionsChangeEvent', null, $scope.handleInstructionsChange, this);
                }
                dispatcherService.addListener('zoomChangeEvent', null, $scope.handleZoomChange, this);
                dispatcherService.addListener('offsetChangeEvent', null, $scope.handleOffsetChange, this);
                dispatcherService.addListener('scrollXChangeEvent', null, $scope.handleScrollXChange, this);
                dispatcherService.addListener('scrollYChangeEvent', null, $scope.handleScrollYChange, this);

                $scope.$watch(() => firebaseAppModel.app.layoutMode, (newVal, oldVal) => {
                    if (newVal !== oldVal) {
                        $timeout(() => {
                            render();
                        }, 400); // if we don't give some time after a fullscreen event for the drawer animation to complete, the PDF viewport may not be ready
                    }
                });

                // handle legacy layout flag
                $scope.$watch(() => firebaseAppModel.app.fullscreen, (newVal, oldVal) => {
                    if (newVal !== oldVal) {
                        $timeout(() => {
                            render();
                        }, 400); // if we don't give some time after a fullscreen event for the drawer animation to complete, the PDF viewport may not be ready
                    }
                });

                AssessmentModel.loadState();

                if (!AssessmentModel.share) {
                    $scope.jumpTo($scope.currentIndex);
                }
                return $q.all([$scope.deferScrollX.promise, $scope.deferScrollY.promise, $scope.deferPage.promise]);
            }

            function handleLoadComplete() {
                $log.debug('[AssessmentPDFContentDirective] handleLoadComplete');
                if (isCanvasReady()) {
                    positionPageFromPercentage(
                        AssessmentModel.getScrollXPercent(), AssessmentModel.getScrollYPercent());
                    if (!$scope.isDoubleSided) {
                        updatePdfHolderOpacity(1.0);
                    }
                }
            }

            $scope.handleScrollXChange = function (eventType, event) {
                updatingScrollFromFb = true;
                if (isCanvasReady()) {
                    const xPercent = event.data;
                    positionPageXFromPercentage(xPercent);
                }
                $scope.loading = false;
                $scope.deferScrollY.resolve();
            };

            $scope.handleScrollYChange = function (eventType, event) {
                updatingScrollFromFb = true;
                if (isCanvasReady()) {
                    const yPercent = event.data;
                    positionPageYFromPercentage(yPercent);
                }
                $scope.loading = false;
                $scope.deferScrollX.resolve();
            };

            $scope.handleZoomChange = function (eventType, event) {
                if (event.data) {
                    if (event.data !== $scope.currentZoom) {
                        updateZoom(event.data);

                        if ($scope.currentZoom < 1.001) {
                            $scope.offsetX = 0;
                            $scope.offsetY = 0;

                            $timeout(() => {});
                        }
                        render();
                    }
                }
            };

            $scope.handleOpacityChange = function(eventType, event) {
                $log.debug('[AssessmentPDFContentDirective] handling remote opacity change: ' + event.data);
                if (event.data !== null && AssessmentModel.getShowInstructions()) {
                    // update view using instructions opacity if instructions are turned on
                    updateOpacity(event.data);
                }
            };

            $scope.handleInstructionsChange = function(eventType, event) {
                $log.debug('[AssessmentPDFContentDirective] handling remote instructions change: ' + event.data);
                $scope.setInstructionsVisible(event.data);
            };

            function updateOpacity(value) {
                $log.debug('[AssessmentPDFContentDirective] updating instruction opacity: ' + value);
                // update view
                updateInstructionHolderOpacity(value);
                // the pdf opacity is related to the instructions opacity according to the linear equation:
                // pdfOpacity = -0.96 * instructionsOpacity + 1
                const pdfValue = (-0.96 * value) + 1;
                updatePdfHolderOpacity(pdfValue);
            }

            function updateInstructionHolderOpacity(value) {
                $log.debug('[AssessmentPDFContentDirective] setting instructions holder opacity to: ' + value);
                instructionsHolder.css('opacity', value);
            }

            function updatePdfHolderOpacity(value) {
                $log.debug('[AssessmentPDFContentDirective] setting pdf holder opacity to: ' + value);
                holder.css('opacity', value);
            }

            $scope.handleOffsetChange = function (eventType, event) {
                if (event.data) {
                    $scope.offsetX = event.data.x;
                    $scope.offsetY = event.data.y;
                }
            };

            $scope.handlePageChange = function (eventType, event) {
                const data = event.data;
                if (data) {
                    if (data.UUID && data.UUID === UUID) {
                        return; // self-invoked, so just skip it
                    }
                    const currentPage = data.currentPage;
                    if (currentPage !== undefined && currentPage !== $scope.currentPage) {
                        gotoPageLocal(currentPage);
                        ready = true;
                        return;
                    }

                    if (ready) {
                        return;
                    }
                }

                if ($scope.studentPages.length > 0) {
                    $scope.currentPage = $scope.studentPages[0];
                } else {
                    $scope.currentPage = 1;
                }
                gotoPageLocal($scope.currentPage);
                ready = true;
            };

            // catch all for errors.
            $scope.handleActivityError = function (error) {
                $log.debug('[AssessmentPDFContentDirective] activity ref load error:' + error.code);
            };
            $scope.$on('$destroy', () => {
                $log.debug('[AssessmentPDFContentDirective] destroy');
                AssessmentModel.setShowInstructions(AssessmentModel.getDefaultShowInstructions());
                cleanup(pdf);
            });

            function setupDrawerCalls() {
                AssessmentModel.channel.bind('next', () => {
                    return $scope.next();
                });

                AssessmentModel.channel.bind('prev', () => {
                    return $scope.prev();
                });

                AssessmentModel.channel.bind('jumpTo', (context1, params) => {
                    return $scope.jumpTo(params);
                });

            }

            function setLoading(value) {
                $scope.loading = value;
                $timeout(() => {
                });
            }

            function isCanvasReady() {
                // simple test for width. we never draw a zero width pdf canvas.
                if (canvas.width() === 0) {
                    return false;
                }
                return true;
            }

            /*******
             * Clean up a loaded pdf or if not loaded yet, destroy the loader. This may cause some rte's in the
             * console especially when the loader is aborted but memory should be released, future networks calls
             * aborted, and subsequent pdf's should load as normal including the instructions.
             * @param pdf
             */
            function cleanup(pdf1) {
                if (pdf1 != null) {
                    try {
                        $log.debug('[AssessmentPDFContentDirective] pdf cleaning up');
                        pdf1.cleanup();
                        pdf1.destroy().then((res) => {
                            $log.debug('[AssessmentPDFContentDirective] pdf destroy complete. ', res);
                        }).catch((error) => {
                            $log.debug('[AssessmentPDFContentDirective] pdf destroy error: ', error);
                        });
                    } catch (error) {
                        // pdfjs throws errors when it interrupts loading on a destroy or cleanup
                        $log.debug(error);
                    }
                }
                if ($scope.loadingTask && !$scope.loadingTask.destroyed) {
                    try {
                        $log.debug('[AssessmentPDFContentDirective] pdf loader destroy');
                        $scope.loadingTask.destroy().then(() => {
                            $log.debug('[AssessmentPDFContentDirective] pdf loader destroy complete.');
                            $scope.loadingTask = null;
                        }).catch((error) => {
                            $log.debug('[AssessmentPDFContentDirective] pdf destroy error: ', error);
                        });
                    } catch (error) {
                        // pdfjs throws errors when it interrupts loading on a destroy or cleanup
                        $log.debug(error);
                    }
                }
            }
        },
    };
};

const assessmentPdfContent = angular.module('toys').directive('assessmentPdfContent', [
    '$log',
    '$q',
    '$window',
    '$timeout',
    '$stateParams',
    'AssessmentModel',
    'dispatcherService',
    'guidService',
    'firebaseAppModel',
    AssessmentPDFContentDirective,
]);
