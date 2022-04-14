let SliderDirective;

SliderDirective = function($log, $document, $timeout) {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            value : '=',
            change: '&'
        },
        template: require('./slider.directive.html'),
        link: function ($scope, $element, $attr) {
            // directive vars
            const min = $attr.min ? parseFloat($attr.min) : 0,
                max = $attr.max ? parseFloat($attr.max) : 100,
                steps = $attr.steps ? parseInt($attr.steps, 10)  : min - max * 10,
                $control = $element.find('.slider-control'),
                $track = $element.find('.guideline'),
                $container = $element.find('.pl-dropdown-container'),
                // Control maintains it's height even when hidden, track will not.
                length = parseInt($control.height(), 10);
            let offset;

            // assign events
            $element.on('touchend mouseup', 'button', toggleSlider);
            $element.on('touchstart mousedown', '.slider-control', starthandle);
            $(document).on('touchend mouseup', onDocumentClick);

            function onDocumentClick(e) {
                const clickInElement =  $element.is(e.target) || $.contains($element[0], e.target);
                if (!clickInElement) {
                    $container.removeClass('active');
                }
            }

            // event handlers
            function toggleSlider(e) {
                if ($.contains($control, e.target) === false) {
                    $container.toggleClass('active');
                }
            }
            function starthandle(e) {
                offset = $track.offset();
                $element.removeClass('animated');
                $(document).on('touchmove', movehandler);
                $(document).on('mousemove', movehandler);
                $(document).on('mouseup', uphandler);

                movehandler(e);

                e.stopPropagation();
            }
            function movehandler(e) {
                updateValue(e);

                $timeout(function() {
                    $scope.change();
                });

                e.stopPropagation();
            }
            function uphandler(e) {
                $element.addClass('animated');
                updateValue(e);

                $timeout(function() {
                    $scope.change();
                });

                $(document).off('mousemove', movehandler);
                $(document).off('touchmove', movehandler);
                $(document).off('mouseup', uphandler);

                e.stopPropagation();
            }

            function updateValue(e) {

                let pageY;

                if (e.type.includes('touch')) {
                    pageY = e.originalEvent.touches[0].pageY;
                } else {
                    pageY = e.pageY;
                }

                const o = Math.max(0, Math.min(length, (length - (pageY - offset.top))));
                const ratio = o / length;
                const quantizedRatio = Math.round(ratio * steps) / steps;
                const range = max - min;
                const val = quantizedRatio * range + min;
                $scope.value = val;
            }

            $scope.getPos = function() {
                const pos = ((max - min) - ($scope.value - min)) / (max - min) * length;
                return {
                    top : pos + 'px'
                };
            };
        }
    };
};

import { commonDirectivesModule } from '../common-directives.module';
const plSlider = commonDirectivesModule.directive('slider', ['$log', '$document', '$timeout', SliderDirective]);
