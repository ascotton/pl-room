import { debounce, throttle } from 'lodash';

declare var PDFJS: any;

class PdfViewerDrawerController {
    constructor($scope, $timeout, activityModel, $q, $log) {
        'use strict';

        const DEFAULT_PAGE_NUM = 1;
        const DEFAULT_ZOOM = 1;
        const DBL_PAGE_EVEN_MODE = 2;
        const DBL_PAGE_ODD_MODE = 3;
        const SINGLE_PAGE_MODE = 1;

        const element = $('.pdf-activity-drawer');
        let pdfDoc;
        let page;
        let totalPages = 0;
        let pagesRendered = [];
        let rotateDeg = 0;
        let pageRotations = {};
        const customZoomInputField = element.find('#customZoomInputField');
        $scope.bookMode = SINGLE_PAGE_MODE;
        $scope.doublePages = [];

        $scope.totalPages = 0;

        function initialize() {
            $scope.thumbs = activityModel.activity.thumbnails;
            $scope.hasThumbs = activityModel.activity.thumbnails && activityModel.activity.thumbnails.length > 0;

            if (!$scope.hasThumbs) {
                element.find('main').on('scroll', throttle(() => {
                    try {
                        renderThumbnails(Object.keys(pageRotations).map(val => parseInt(val.slice(4), 10)));
                    } catch (e) {
                        $log.debug('PdfViewerDrawerController error rendering thumbnails: ', e);
                    }
                }, 100));
            }

            scrollToPage($scope.currentPage);

            const ref = activityModel.getSessionRef();
            if (ref) {
                ref.child('pageRotation').on('value', (snap) => {
                    pageRotations = snap.val() || {};
                    // tslint:disable-next-line:forin
                    for (const pageToRotate in pageRotations) {
                        if (pageRotations[pageToRotate] >= 0) {
                            if ($scope.hasThumbs) {
                                $scope.thumbRotations = pageRotations;
                            } else {
                                renderRotate(
                                    parseInt(pageToRotate.slice(4), 10),
                                    pageRotations[pageToRotate],
                                );
                            }
                        }
                    }
                });
            }
        }

        $scope.addFoundationListener = () => {
            activityModel.foundationLoaded.then(() => {
                $scope.currentScale = 1;

                activityModel.channel.bind('gotoPage', (trans, pageNum) => {
                    $scope.currentPage = pageNum;
                    $scope.selectedPage = $scope.currentPage;
                    $scope.$evalAsync();
                });

                loadState().then(() => {
                    $scope.setCustomZoomDisplayValue($scope.currentScale);
                    activityModel.getSessionRef().child('pageRotation').once('value', (snap) => {
                        pageRotations = snap.val() || {};

                        $scope.hasThumbs = activityModel.activity.thumbnails && activityModel.activity.thumbnails.length > 0;

                        if (!$scope.hasThumbs) {
                            loadPDF(activityModel.activity.config)
                            .then(() => renderThumbnails([]))
                            .then(initialize);
                        } else {
                            totalPages = activityModel.activity.thumbnails.length;
                            configurePages(totalPages);
                            $timeout();
                            try {
                                $scope.$digest();
                            } catch (e) {
                                $log.debug('PdfViewerDrawerController error on scope digest in getDocument in pdfViewerDrawerController');
                            }
                            initialize();
                        }
                    });
                });
            },
                                                undefined,
                                                value => $scope.addFoundationListener());
        };

        $scope.getThumbStyle = (pageNum: string) => {
            const style: any = {};
            if ($scope.thumbRotations) {
                const degrees = $scope.thumbRotations[ 'page' + pageNum];
                if (degrees) {
                    style.transform = `rotate(${degrees}deg)`
                    if (degrees === 90 || degrees === 270) {
                        // this 97px is a product of the thumbnail height being pegged 
                        // to 97px in CSS
                        style['max-width'] = '97px';
                    }
                }
            }
            return style;
        }

        $scope.addFoundationListener();

        $scope.zoomOptions = {
            '10%': 0.10,
            '25%': 0.25,
            '50%': 0.5,
            '75%': 0.75,
            '100%': 1,
            '125%': 1.25,
            '150%': 1.5,
            '175%': 1.75,
            '200%': 2,
            '300%': 3,
            '600%': 6,
        };

        $scope.bookOptions = {
            Single: 1,
            'Double (start pg 1)': 2,
            'Double (start pg 2)': 3,
        };

        $scope.setCustomZoomDisplayValue = (zoomScale) => {
            $scope.customZoomDisplayValue = Number((zoomScale * 100).toFixed(0));
        };

        $scope.fixCustomZoomDisplayValueAndUpdateScale = () => {
            let zoom = Number($scope.customZoomDisplayValue);
            zoom = zoom < 10 ? 10 : (zoom > 600 ? 600 : zoom);
            $scope.currentScale = (zoom / 100);
            $scope.customZoomDisplayValue = zoom;
            $scope.zoomTo($scope.currentScale);
        };

        /**
         * ALLOW:
         *   - number keys
         *   - shift with left, right arrow keys
         *   - delete, backspace keys
         * DISALLOW:
         *   - shift with number keys
         *   - alt with number keys
         *   -
         * @param event
         */
        $scope.restrictToNumericEntry = (event) => {
            const isNumberKey = (event.keyCode >= 48 && event.keyCode <= 57); // numbers
            const isValidKey = isNumberKey
                || event.keyCode === 8 // backspace
                || event.keyCode === 13 // enter
                || event.keyCode === 37 // left arrow
                || event.keyCode === 39 // right arrow
                || event.keyCode === 46; // delete
            const isModifierKey = event.altKey || event.shiftKey || event.ctrlKey;

            if (!isValidKey || (isNumberKey && isModifierKey)) {
                event.preventDefault();
            }
        };

        $scope.zoomInputFieldOnBlur = (event) => {
            // reset zoom input field if user clicks outside the input field without pressing Enter
            if ($scope.currentScale !== ($scope.customZoomDisplayValue / 100)) {
                $scope.setCustomZoomDisplayValue($scope.currentScale);
            }

            ZoomUpdateHandler.onBlurCustomZoomInput();
        };

        function calcScale(pdfW, pdfH, containerW, containerH, scale) {
            let newScale = scale;
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

        $scope.getDisplayMode = () => {
            if ($scope.bookMode === SINGLE_PAGE_MODE) {
                return 'Single';
            }
            if ($scope.bookMode === DBL_PAGE_EVEN_MODE) {
                return 'Double (pg 2)';
            }
            return 'Double (pg 1)';
        };

        $scope.next = () => {
            let pageDest;
            if ($scope.bookMode === SINGLE_PAGE_MODE) {
                pageDest = Math.min($scope.currentPage + 1, totalPages);

            } else {
                pageDest = Math.min($scope.currentPage + 2, totalPages);
                if ($scope.bookMode === DBL_PAGE_EVEN_MODE && $scope.currentPage === 1) {
                    pageDest = 2;
                }
            }
            $scope.gotoPage(pageDest);

        };

        $scope.prev = () => {
            let pageDest;
            if ($scope.bookMode === SINGLE_PAGE_MODE) {
                pageDest = Math.max($scope.currentPage - 1, 1);

            } else {
                pageDest = Math.max($scope.currentPage - 2, 1);
                if ($scope.bookMode === DBL_PAGE_EVEN_MODE && $scope.currentPage === totalPages &&
                    totalPages % 2 !== 0) {
                    pageDest = totalPages - 1;
                }
            }
            $scope.gotoPage(pageDest);
        };

        $scope.switchModeTo = (bookVal) => {

            pagesRendered = [];
            $scope.bookMode = bookVal;
            $timeout();
            if (bookVal === DBL_PAGE_EVEN_MODE) {
                $scope.doublePages = $scope.doublePagesEven;
            } else if (bookVal === DBL_PAGE_ODD_MODE) {
                $scope.doublePages = $scope.doublePagesOdd;
            }

            setTimeout(() => {
                $scope.$apply();
                renderThumbnails(Object.keys(pageRotations).map(val => parseInt(val.slice(4), 10)));
            },         100);

            $scope.$evalAsync();

            activityModel.channel.call({
                method: 'switchMode',
                params: bookVal,
                success: () => {

                },
            });
        };

        $scope.zoomTo = zoomVal => activityModel.channel.call({
            method: 'zoom',
            params: zoomVal,
            success: () => {
                $scope.currentScale = zoomVal;
                $scope.setCustomZoomDisplayValue($scope.currentScale);
                ZoomUpdateHandler.onClickZoomOptions();
                $scope.$evalAsync();
            },
        });

        // When the custom zoom input field blurs, we want to close the zoom options dropdown
        // However, if the blur happened from clicking a zoom option, closing it immediately
        // would inappropriately short-circuit the zoom option selection. To remedy this,
        // delay the field onBlur action to give the select onClick action a chance to set
        const ZoomUpdateHandler = {
            onBlurCustomZoomInput: () => {
                $timeout(() => $(document).trigger('closeAllDropdowns'), 100);
            },
            onClickZoomOptions: () => {
                customZoomInputField.blur();
                $(document).trigger('closeAllDropdowns');
            },
        };

        $scope.rotate90 = function () {
            $scope.gotoPage($scope.currentPage);

            rotateDeg = 90; // default
            if ((<any>window).heap) {
                (<any>window).heap.track('Rotation', { document_name: activityModel.configModel.model.name });
            }

            const existingRotationKey = Object.keys(pageRotations).find(pageToRotate =>
                parseInt(pageToRotate.slice(4), 10) === $scope.currentPage,
            );

            const existingRotation = pageRotations[existingRotationKey];

            if (existingRotation) {
                rotateDeg += existingRotation;
            }

            activityModel.getSessionRef()
                .child('pageRotation')
                .child('page' + $scope.currentPage)
                .set(rotateDeg % 360);
        };

        $scope.zoom = () => {
            const scale = $scope.currentScale;

            activityModel.channel.call({
                method: 'zoom',
                params: scale,
                success: () => {
                    $scope.currentScale = scale;
                    $scope.$evalAsync();
                },
            });
        };

        $scope.gotoPageChannel = debounce((pageNum) => {
            activityModel.channel.call({
                method: 'gotoPage',
                params: pageNum,
                success: () => {
                    checkDisableNavButtons();
                },
            });
        },                                  200);

        $scope.gotoPage = (pageNum) => {
            if (pageNum === undefined) {
                pageNum = Math.min(totalPages, Math.max(1, parseInt($scope.currentPage, 10)));
            }

            $scope.currentPage = $scope.selectedPage = pageNum;
            if ($scope.bookMode === DBL_PAGE_ODD_MODE && pageNum % 2 === 0) {
                pageNum--;
            }
            if ($scope.bookMode === DBL_PAGE_EVEN_MODE && pageNum % 2 === 1 && pageNum !== 1) {
                pageNum--;
            }

            scrollToPage(pageNum);

            $scope.gotoPageChannel(pageNum);
        };

        function escapeHandler(e) {
            if (e.keyCode === 27) {
                $('.jumpToInput').blur();
            }
        }

        $(document).on('keyup', escapeHandler);
        $scope.$on('$destroy', () => $(document).off('keyup', escapeHandler));

        function renderRotate(pageNum, rotateDeg2) {
            if ($scope.hasThumbs || $scope.bookMode > SINGLE_PAGE_MODE) {
                return;
            }

            const canv: any = $('#pageCanvas' + pageNum)[0];
            const loader = $('.loader' + pageNum);
            const isVertical = rotateDeg2 === 0 || rotateDeg2 % 180 === 0;

            if (rotateDeg2 > 270) {
                rotateDeg2 = rotateDeg2 % 360;
            }

            if (!pdfDoc) {
                return;
            }

            pdfDoc.getPage(pageNum).then((p) => {
                page = p;
                canv.height = 97;
                canv.width = 140;

                let viewport = page.getViewport(1.0);
                let newScale;

                if (isVertical) {
                    newScale = calcScale(viewport.width, viewport.height, canv.width, canv.height, 1);
                } else {
                    newScale = calcScale(viewport.height, viewport.width, canv.width, canv.height, 1);
                }

                const context = canv.getContext('2d');

                viewport = page.getViewport(newScale, rotateDeg2);

                if (viewport.height < canv.height) {
                    canv.height = viewport.height;
                }

                if (viewport.width <= canv.width) {
                    const offset = (element.find('#pdfThumbnails').width() - viewport.width) / 2;

                    $(canv).css('left', offset);

                    canv.width = viewport.width;
                }

                const renderContext = {
                    viewport,
                    canvasContext: context,
                };

                loader.removeClass('hide');

                page.render(renderContext);
            }).then(() => loader.addClass('hide'));
        }

        function renderPage(pageNum) {
            if (~pagesRendered.indexOf(pageNum)) {
                return;
            }
            pagesRendered.push(pageNum);

            const defer = $q.defer();

            const canv: any = $('#pageCanvas' + pageNum)[0];
            const canvHolder: any = $('.canvasContainer')[0];
            const loader = $('.loader' + pageNum);

            loader.removeClass('hide');

            if (!pdfDoc || !canv || !canvHolder || ! loader) {
                $log.debug(`bailing on renderPage #: ${pageNum}
                            pdf:${pdfDoc}, 
                            canv: ${canv},
                            canvHolder: ${canvHolder},
                            loader: ${loader}`);
                return;
            }

            const rotationKey = Object.keys(pageRotations).find(pageToRotate =>
               parseInt(pageToRotate.slice(4), 10) === pageNum,
            );

            let rotation = pageRotations[rotationKey];

            if (!rotation) {
                rotation = 0;
            }

            let containerWidth = canv.clientWidth;
            let containerHeight = canv.height;

            if ($scope.bookMode > SINGLE_PAGE_MODE) {
                containerWidth = (canvHolder.clientWidth / 2) - 10;
                containerHeight = canvHolder.clientHeight;
            }

            try {

                pdfDoc.getPage(pageNum).then((p) => {
                    page = p;
                    canv.height = 97;

                    let viewport = page.getViewport(1.0, rotation);
                    let viewportScale;
                    if (viewport.width > viewport.height || $scope.bookMode === SINGLE_PAGE_MODE) {
                        viewportScale = calcScale(viewport.width, viewport.height, containerWidth, containerHeight, 1);
                    } else {
                        viewportScale = calcScale(viewport.height, viewport.width, containerWidth, containerHeight, 1);
                    }

                    //  = calcScale(viewport.width, viewport.height, containerWidth, containerHeight, 1);
                    const context = canv.getContext('2d');

                    viewport = page.getViewport(viewportScale, rotation);

                    if (viewport.height < canv.height) {
                        canv.height = viewport.height;
                    }

                    if (viewport.width <= canv.width) {
                        const offset = (element.find('#pdfThumbnails').width() - viewport.width) / 2;

                        $(canv).css('left', offset);

                        canv.width = viewport.width;
                    }

                    const renderContext = {
                        viewport,
                        canvasContext: context,
                    };

                    return page.render(renderContext);
                }).then(() => {

                    loader.addClass('hide');

                    defer.resolve();
                });
            } catch (e) {
                $log.debug('PdfViewerDrawerController error rendering page: ', e);
                defer.resolve();
            }

            return defer.promise;
        }

        function scrollToPage(pageNum) {
            if (!pageNum) {
                pageNum = 1;
            }

            if ($scope.bookMode === DBL_PAGE_EVEN_MODE) {
                pageNum = Math.ceil((pageNum / 2) + 1);
            } else if ($scope.bookMode === DBL_PAGE_ODD_MODE) {
                pageNum = Math.ceil(pageNum / 2);
            }

            const selector = `.thumbnails > button:nth-child(${pageNum})`;
            const thumbnail = element.find(selector);
            const main = element.find('main');

            if (!thumbnail) {
                return;
            }

            const thumbnailOffset = thumbnail.offset();
            if (!thumbnailOffset) {
                $log.debug('PdfViewerDrawerController thumbnail missing, bailing...');
                return;
            }
            const thumbnailTop = thumbnailOffset.top;
            const thumbnailBottom = thumbnailOffset.top + thumbnail.height();

            const mainOffset = main.offset();
            const mainTop = mainOffset.top;
            const mainBottom = mainTop + main.height();

            const scrollPos = main.scrollTop();

            // scroll up
            if (thumbnailTop < mainTop) {
                const delta = mainTop - thumbnailTop;
                main.scrollTop(scrollPos - delta);
            }

            // scroll down
            if (thumbnailBottom > mainBottom) {
                const delta = thumbnailBottom - mainBottom;
                main.scrollTop(scrollPos + delta);
            }
        }

        function percentVisible(pageNum) {

            if ($scope.bookMode === DBL_PAGE_EVEN_MODE) {
                pageNum = Math.ceil((pageNum / 2) + 1);
            } else if ($scope.bookMode === DBL_PAGE_ODD_MODE) {
                pageNum = Math.ceil(pageNum / 2);
            }
            if ($scope.doublePages.length > 0) { // if in double modes
                pageNum = Math.min($scope.doublePages.length, pageNum);
            }

            const selector = `.thumbnails > button:nth-child(${pageNum})`;
            const thumbnail = element.find(selector);
            const main = element.find('main');
            const thumbnailPos = thumbnail.offset();
            let thumbnailTop;
            if (thumbnailPos) {
                thumbnailTop = thumbnailPos.top;
            } else {
                return 1;
            }
            const thumbnailBottom = thumbnailTop + thumbnail[0].clientHeight;
            const mainTop = main.offset().top;
            const mainBottom = mainTop + main.height();

            // the thumbnail is above main
            if (thumbnailBottom < mainTop) {
                return 0;
            }

            // the thumbnail is below main
            if (thumbnailTop > mainBottom) {
                // thumbnail will be shown soon
                // so we have to render it already
                if (thumbnailTop - mainBottom < thumbnail.height() * 2) {
                    return 1.0;
                }

                return 0;
            }

            // the thumbnail is fully visible
            if (thumbnailTop >= mainTop && thumbnailBottom <= mainBottom) {
                return 100.0;
            }

            // the thumbnail is partially visible at the top of main
            if (thumbnailTop < mainTop && thumbnailBottom > mainTop) {
                return (mainBottom - thumbnailTop) / thumbnail.height();
            }

            // the thumbnail is partially visible at the bottom of main
            if (thumbnailBottom > mainBottom && thumbnailTop < mainBottom) {
                return (thumbnailBottom - mainTop) / thumbnail.height();
            }

            return 0;
        }

        function renderThumbnails(skip) {
            if ($scope.hasThumbs) {
                return;
            }

            // if ($scope.bookMode > 1){
            skip = [];
            // }

            const promises = [];

            for (let i = 0; i < totalPages; i++) {
                const pageNum = i + 1;

                if (percentVisible(pageNum) > 0 && (!skip || skip.indexOf(pageNum) === -1)) {
                    promises.push($q.when(renderPage(pageNum)));
                }
            }

            return $q.all(promises);
        }

        $scope.getThumbnailClasses = (targetPage) => {
            const classes = [];

            if (targetPage === $scope.selectedPage) {
                classes.push('active');
            }

            return classes;
        };

        function loadState() {
            const deferPageNum = $q.defer();
            const deferZoom = $q.defer();

            activityModel.getSessionRef().child('pageNum')
                .once('value', (snap) => {
                    const pageNum = snap.val();

                    if (pageNum) {
                        $scope.selectedPage = $scope.currentPage = pageNum;
                        $scope.$evalAsync();
                    } else {
                        $scope.selectedPage = $scope.currentPage = DEFAULT_PAGE_NUM;
                    }

                    deferPageNum.resolve();
                });

            activityModel.getSessionRef().child('scale')
                .once('value', (snap) => {
                    const zoom = snap.val();

                    if (zoom) {
                        $scope.currentScale = zoom;
                        $scope.$evalAsync();
                    } else {
                        $scope.currentScale = DEFAULT_ZOOM;
                    }

                    deferZoom.resolve();
                });

            activityModel.getSessionRef().child('bookMode')
                .once('value', (snap) => {
                    const mode = snap.val();

                    if (mode) {
                        $scope.bookMode = mode;
                        $scope.$evalAsync();
                    } else {
                        $scope.bookMode = SINGLE_PAGE_MODE;
                    }

                });

            return $q.all([deferPageNum.promise, deferZoom.promise]);
        }

        function checkDisableNavButtons() {
            const prevBtn = element.find('.prevBtn');
            const nextBtn = element.find('.nextBtn');

            if ($scope.currentPage === 1) {
                $(prevBtn).addClass('disabled');
                $(prevBtn).prop('disabled', true);

                $(nextBtn).removeClass('disabled');
                $(nextBtn).prop('disabled', false);
            } else if ($scope.currentPage === totalPages || ($scope.currentPage + 1 === totalPages &&
                    $scope.bookMode > SINGLE_PAGE_MODE)) {
                $(prevBtn).removeClass('disabled');
                $(prevBtn).prop('disabled', false);

                $(nextBtn).addClass('disabled');
                $(nextBtn).prop('disabled', true);
            } else {
                $(prevBtn).removeClass('disabled');
                $(prevBtn).prop('disabled', false);

                $(nextBtn).removeClass('disabled');
                $(nextBtn).prop('disabled', false);
            }
        }

        function loadPDF(url) {
            return PDFJS.getDocument(url).then(
                (loaded_pdf) => {
                    try {
                        pdfDoc = loaded_pdf;
                        totalPages = pdfDoc.pdfInfo.numPages;
                        configurePages(totalPages);
                        $timeout();

                        try {
                            $scope.$digest();
                        } catch (e) {
                            $log.debug('PdfViewerDrawerController error on scope digest in getDocument in pdfViewerDrawerController');
                        }
                    } catch (e) {
                        $log.debug('PdfViewerDrawerController error in load PDF');
                    }

                    return this;
                },
                (error) => {
                    $log.debug('PdfViewerDrawerController PDFJS Error while getting PDF document in PdfViewerDrawerController:', error);
                },).catch(e => { 
                    $log.debug('PdfViewerDrawerController PDFJS load error in PdfViewerDrawerController: ', e); 
                });
        }

        function configurePages(count) {
            $scope.totalPages = count;
            $scope.pages = [];
            $scope.doublePagesEven = [];
            $scope.doublePagesOdd = [];

            for (let i = 1; i <= totalPages; i++) {
                $scope.pages.push(i);
            }
            for (let i = 1; i <= totalPages; i = i + 2) {
                if (i + 1 <= totalPages) {
                    $scope.doublePagesOdd.push([i, i + 1]);
                } else {
                    $scope.doublePagesOdd.push([i]);
                }
            }
            $scope.doublePagesEven.push([1]);
            for (let i = 2; i < totalPages; i = i + 2) {
                if (i + 1 <= totalPages) {
                    $scope.doublePagesEven.push([i, i + 1]);
                } else {
                    $scope.doublePagesEven.push([i]);
                }

            }
            if (totalPages % 2 === 0) {
                $scope.doublePagesEven.push([totalPages]);
            }

            if ($scope.bookMode === DBL_PAGE_EVEN_MODE) {
                $scope.doublePages = $scope.doublePagesEven;
            } else if ($scope.bookMode === DBL_PAGE_ODD_MODE) {
                $scope.doublePages = $scope.doublePagesOdd;
            }
            $timeout();
        }


        $scope.pageExists = (pageNum) => {
            if (isNaN(pageNum)) {
                return true;
            }
            return false;
        };

        $scope.$on('$destroy', () => {
            if (pdfDoc) {
                pdfDoc.destroy();
            }
            pdfDoc = null;
        });
    }
}

export default PdfViewerDrawerController;

import * as angular from 'angular';
import { retryWhen } from 'rxjs/operators';
const pdfViewerDrawerController = angular.module('toys').controller('PdfViewerDrawerController', [
    '$scope',
    '$timeout',
    'activityModel',
    '$q',
    '$log',
    PdfViewerDrawerController,
]);
