import { each, find, throttle } from 'lodash';
import * as PDFJS from 'pdfjs-dist';

/**
 * Created by bohdanivanov on 5/25/16.
 */
const AssessmentPDFDrawerController = function (
    $log,
    $scope,
    $q,
    $stateParams,
    $compile,
    AssessmentModel,
    dispatcherService,
    hotkeys) {

    let pdf: any;
    let url = '';

    const element = $('.assessment-drawer'); //
    $scope.isDoubleSided = false;

    const BOTTOM_BUFFER = 300;
    const TOP_BUFFER = 100;

    $scope.options = { customZoomDisplayValue: 100 };

    const zoomInput = (<any>element.find('#customZoomInputField'));

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

    $scope.studentPages = [];

    AssessmentModel.foundationLoaded.then(() => {
        AssessmentModel.channel.bind('selectPage', (context, params) => {
            const pageNum = $scope.studentPages.indexOf(params) + 1;
            return ($scope.currentPage !== pageNum || !$('.activePage').length) && $scope.selectPage(params);
        });

        AssessmentModel.channel.bind('selectInstructions', (context, params) => {
            $('#instructionsToggleButton').toggleClass('selected', params[0]);
        });

        loadState();
    });

    $scope.toggleInstructions = function () {
        AssessmentModel.toggleInstructions();
    };

    $scope.zoomInputFieldOnBlur = function(event) {

    };

    $scope.submitZoomManually = function ($event) {
        const zoomValue = $event.currentTarget.children[0].children[0].value;
        $scope.submitZoom(zoomValue / 100);
    };

    $scope.submitZoom = function (zoomValue) {
        if (zoomValue) {
            $scope.options.customZoomDisplayValue = Number((zoomValue * 100).toFixed(0));
            zoomInput.value = $scope.options.customZoomDisplayValue;
        }
        AssessmentModel.channel.call({
            method: 'changeZoomValue',
            params: [zoomValue],
        });
    };

    // Copied from PdfviewerDrawerController.js
    $scope.restrictToNumericEntry = (event) => {

        const isNumberKey = (event.keyCode >= 48 && event.keyCode <= 57); // numbers
        const isValidKey =  isNumberKey
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

    // Copied from PdfviewerDrawerController.js
    $scope.fixCustomZoomDisplayValueAndUpdateScale = () => {
        let zoom = Number($scope.options.customZoomDisplayValue);
        zoom = zoom < 10 ? 10 : (zoom > 600 ? 600 : zoom);
        $scope.currentScale = (zoom / 100);
        $scope.options.customZoomDisplayValue = zoom;
        $scope.zoomTo($scope.currentScale);
    };

    $scope.next = function () {
        $scope.jumpTo($scope.currentPage + 1);
    };

    function scrollTo(selectedItem, main) {
        if (!selectedItem) {
            return;
        }

        const thumbnailOffset = selectedItem.offset();

        if (thumbnailOffset) {
            const thumbnailTop = thumbnailOffset.top;
            const thumbnailBottom = thumbnailOffset.top + selectedItem.height();

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
    }

    $scope.prev = function () {
        $scope.jumpTo($scope.currentPage - 1);
    };

    $scope.jumpTo = function (newPage) {
        AssessmentModel.channel.call({
            method: 'jumpTo',
            params: newPage,
            success(index) {
                $('.activePage').removeClass('activePage');
                $scope.currentPage = index + 1;
                checkDisableNavButtons();
                const newActive = $('#pdfThumbnails').children()[index];
                $(newActive).addClass('activePage');

                if (!isScrolledIntoView(newActive)) {
                    scrollTo($(newActive), $('#documentThumbnails'));
                }

                $scope.$evalAsync();
            },
        });
    };

    $scope.selectPage = function (pageNum) {
        const newIndex = $scope.studentPages.indexOf(pageNum);
        $('.activePage').removeClass('activePage');
        $scope.currentPage = newIndex + 1;
        const newActive = $('#pdfThumbnails').children()[newIndex];
        $(newActive).addClass('activePage');
        checkDisableNavButtons();

        if (!isScrolledIntoView(newActive)) {
            scrollTo($(newActive), $('#documentThumbnails'));
        }

        $scope.$evalAsync();
    };

    $scope.jump = function (pageNum, evt) {
        AssessmentModel.channel.call({
            method: 'jumpTo',
            params: pageNum,
            success(index) {
                $('.activePage').removeClass('activePage');
                $scope.currentPage = index + 1;
                const newActive = $('#pdfThumbnails').children()[index];
                $(newActive).addClass('activePage');
                checkDisableNavButtons();

                $scope.$evalAsync();
            },
        });
    };

    $scope.updateOpacity = function(value) {
        AssessmentModel.saveOpacity(value);
    };

    function checkDisableNavButtons() {
        const prevBtn = element.find('.prevBtn');
        const nextBtn = element.find('.nextBtn');

        if ($scope.currentPage === 1) {
            $(prevBtn).addClass('disabled');
            $(prevBtn).prop('disabled', true);

            $(nextBtn).removeClass('disabled');
            $(nextBtn).prop('disabled', false);

        } else if ($scope.currentPage === $scope.totalNumPages) {
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

    function isScrolledIntoView(elem) {
        const $elem = $(elem);
        const documentThumbnails = $('#documentThumbnails');
        const rect = $elem.offset();
        if (rect === undefined || rect.top === undefined) {
            return false;
        }
        const docViewTop = documentThumbnails.offset().top;
        const docViewBottom = docViewTop + documentThumbnails.height();
        const elemTop = rect.top + TOP_BUFFER;
        const elemBottom = elemTop + $elem.height() - BOTTOM_BUFFER;
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    let page;
    const pagesAlreadyRendered = [];

    function renderThumbnailsInView() {
        each($scope.studentPages, (pageNum, index) => {
            const idNum = index + 1;
            const canv: any = $('#pageCanvas' + idNum)[0];

            const alreadyRendered = find(pagesAlreadyRendered, (pg) => {
                return pg === idNum;
            });

            if (canv !== undefined && isScrolledIntoView($(canv).parent()) && !alreadyRendered) {
                pagesAlreadyRendered.push(idNum);
                if (!pdf) {
                    return;
                }
                pdf.getPage(pageNum).then((p) => {
                    page = p;
                    canv.height = 97;

                    let viewport = page.getViewport(1.0);
                    const newScale = calcScale(viewport.width, viewport.height, canv.width, canv.height, 1);

                    const context = canv.getContext('2d');
                    viewport = page.getViewport(newScale);
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

                    page.render(renderContext);

                    $(canv).parent().find('.loader').remove();

                });
            }
        });
    }

    function loadState() {
        if (AssessmentModel.share) {
            dispatcherService.addListener('zoomChangeEvent', null, $scope.handleZoomChange, this);
        }
    }

    $scope.handleZoomChange = function(eventType, event) {
        $scope.options.customZoomDisplayValue = Number((event.data * 100).toFixed(0));

        if ($scope.options.customZoomDisplayValue === 0) {
            $scope.options.customZoomDisplayValue = 100;
        }

        zoomInput.value = $scope.options.customZoomDisplayValue;
    };

    function loadThumbnails() {
        const loadPdf = (pdf_url) => {
            $scope.loadingTask = PDFJS.getDocument(pdf_url);
            $scope.loadingTask.then((loaded_pdf) => {
                pdf = loaded_pdf;
                renderThumbnailsInView();
            });
        };
        // check if this url is already cached before we ask for it
        let pdf_url = AssessmentModel.cachedProtectedAsset(url);
        if (pdf_url == null) {
            $scope.secureUrl = AssessmentModel.getProtectedContentUrl(url).then((data) => {
                pdf_url = data.assets[url];
                loadPdf(pdf_url);
            });
        } else {
            loadPdf(pdf_url);
        }
    }

    function init() {
        $log.debug('AssessmentPDFDrawerController init');

        url = AssessmentModel.activity.config.url;
        $scope.thumbs = AssessmentModel.activity.thumbnails;
        $scope.hasThumbs = $scope.thumbs && $scope.thumbs.length > 0;

        const pages = AssessmentModel.activity.config['pages'];

        if (pages[0].instructions !== undefined) {
            $scope.isDoubleSided = true;
        }

        each(pages, (pg) => {
            $scope.studentPages.push(pg.stimulus);
        });

        $scope.totalNumPages = $scope.studentPages.length;
        $scope.currentScale = 1;
        $scope.currentPage = 1;

        if (!$scope.hasThumbs) {
            loadThumbnails();
        }
        checkDisableNavButtons();

        if (!AssessmentModel.share) {
            $scope.next();
        }

        element.find('#documentThumbnails').on('scroll', throttle(() => {
            if (pdf && !$scope.hasThumbs) {
                renderThumbnailsInView();
            }
        },                                                          250));

        $scope.$evalAsync();
    }

    AssessmentModel.foundationLoaded.then(init);

    $scope.$on('$destroy', () => {
        if (pdf) {
            pdf.destroy();
        }
        pdf = null;
    });

};

import * as angular from 'angular';
const assessmentPDFDrawerController = angular.module('toys').controller('assessmentPDFDrawerController', [
    '$log',
    '$scope',
    '$q',
    '$stateParams',
    '$compile',
    'AssessmentModel',
    'dispatcherService',
    'hotkeys',
    AssessmentPDFDrawerController,
]);
