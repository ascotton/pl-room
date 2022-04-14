import * as angular from 'angular';

const DropdownDirective = function DropdownDirective($log, $timeout) {
    return {
        restrict: 'A',
        scope: {
            dropContent: '@plDropdownContent',
            // A css selector of a container to keep the dropdown confined to. Defaults to window.
            container: '@',
            offsetX: '@',
            multiclick: '=',
            fromBottom: '=',
            autoclose: '@',
            preventFromClosing: '@plDropdownPreventFromClose'
        },
        link: function DropdownDirectiveLink($scope, $element) {
            let dropdown;
            let container;
            const openDropdownClass = 'dropdown-opened';

            function positionDropdown() {
                const MIN_CONTAINER_MARGIN = 10;
                const ARROW_HEIGHT = 10;
                const eleLeft = $element.position().left;
                const eleWidth = $element.outerWidth(true);
                const eleXCenter = eleLeft + eleWidth / 2;
                const eleTop = $element.position().top;
                const eleHeight = $element.outerHeight(true);
                const eleBottom = eleTop + eleHeight;

                const dropdownWidth = dropdown.outerWidth();
                let dropdownLeft = eleXCenter - dropdownWidth / 2;
                const dropdownRight = dropdownLeft + dropdownWidth;
                const dropdownTop = eleBottom;

                const containerLeft = $.isWindow(container[0]) ? 0 : container.position().left;
                const containerRight = containerLeft + container.width();

                const containerDeltaLeft = dropdownLeft - containerLeft;
                const containerDeltaRight = containerRight - dropdownRight;

                if (containerDeltaLeft < MIN_CONTAINER_MARGIN) {
                    dropdownLeft = dropdownLeft - containerDeltaLeft + MIN_CONTAINER_MARGIN;
                } else if (containerDeltaRight < MIN_CONTAINER_MARGIN) {
                    dropdownLeft = dropdownLeft + containerDeltaRight - MIN_CONTAINER_MARGIN;
                    // dropdown.arrow.css('left', width / 2 + 10 - dropRightFromContainer);
                }

                if ($scope.offsetX) {
                    const offsetX = parseInt($scope.offsetX, 10);
                    dropdownLeft += offsetX;
                }

                if ($scope.fromBottom) {
                    dropdown.css({
                        top: 'auto',
                        bottom: eleBottom + ARROW_HEIGHT,
                    });
                } else {
                    dropdown.css('top', dropdownTop);
                }
                dropdown.css('left', dropdownLeft);
                dropdown.arrow.css('left', eleXCenter - dropdownLeft);
            }

            function openDropdown() {
                positionDropdown();
                $element.addClass(openDropdownClass);

                $(window).on('resize', positionDropdown);
                dropdown
                    .removeClass('animate-out')
                    .addClass('animate-in');
                dropdown.active = true;

                if ($scope.autoclose) {
                    $scope.addAutoclose(parseInt($scope.autoclose, 10));
                }

            }

            function closeDropdown() {
                $element.removeClass(openDropdownClass);
                $(window).off('resize', positionDropdown);
                dropdown
                    .removeClass('animate-in')
                    .addClass('animate-out');
                $timeout(() => {
                    dropdown.removeClass('animate-out');
                }, 400);
                dropdown.active = false;

                if ($scope.autoclose) {
                    cleanupTimer();
                }
            }

            function onDocumentClick(e) {
                const clickInElement = $element.is(e.target) || $.contains($element[0], e.target);
                const clickInDropdown = dropdown.is(e.target) || $.contains(dropdown[0], e.target);

                if (dropdown.active) {

                    if (clickInElement) {
                        closeDropdown();
                    } else if (!$scope.multiclick) {
                        if (!clickInElement && !clickInDropdown) {
                            closeDropdown();

                        } else if (!$scope.preventFromClosing) {
                            // if we get this far and the target is the content, that actually
                            // corresponds to a scrollbar click
                            if (!$(e.target).is($($scope.dropContent))) {
                                closeDropdown();
                            }
                        }
                    } else if (!clickInElement && !clickInDropdown) {
                        // a click on the document outside the button or target dropdown always closes.
                        closeDropdown();
                    }
                } else {
                    if (clickInElement) {
                        openDropdown();
                    }
                }


            }

            $scope.addAutoclose = function(delay) {
                $scope.startAutocloseTimer(delay);
                // kick the timer if the user isn't idle
                $log.debug('[PLDropDown] addAutoClose to dropdown');
                $scope.delay = delay;
                $(document).off('mousemove', $scope.handleMouseMove).on('mousemove', $scope.handleMouseMove);
            };

            $scope.handleMouseMove = function() {
                $scope.cancelAutocloseTimer();
                $scope.startAutocloseTimer($scope.delay);
            };

            $scope.startAutocloseTimer = function(delay) {
                $scope.autocloseTimer = $timeout(() => {
                    $log.debug('[PLDropDown] auto-closing dropdown');
                    closeDropdown();
                }, delay);
            };

            function cleanupTimer() {
                $(document).off('mousemove', $scope.handleMouseMove);
                if ($scope.autocloseTimer) {
                    $scope.cancelAutocloseTimer();
                    $scope.autocloseTimer = null;
                }
            }

            $scope.cancelAutocloseTimer = function() {
                $timeout.cancel($scope.autocloseTimer);
            };

            function createDropdown() {
                const plDropdownContainer = $('<div>', {
                    class: 'pl-dropdown-container',
                });
                const arrow = $('<figure>', {
                    class: 'arrow',
                });
                const side1 = $('<div>', {
                    class: 'side-1',
                });
                const side2 = $('<div>', {
                    class: 'side-2',
                });
                const content = $($scope.dropContent);
                if (content.length) {
                    arrow
                        .append(side1)
                        .append(side2);
                    plDropdownContainer
                        .append(arrow)
                        .append(content);
                    (<any> plDropdownContainer).arrow = side1.add(side2);
                    $element.after(plDropdownContainer);
                    if ($scope.fromBottom) {
                        plDropdownContainer.addClass('from-bottom');
                    }
                    return plDropdownContainer;
                }
                return null;
            }

            if ($scope.container) {
                container = $($scope.container);
            } else {
                container = $(window);
            }

            // call createDropdown() only after a $timeout to ensure that parent directives get a chance to compile
            // before createDropdown() attempts to select the dropdown content element.
            $timeout(() => {
                dropdown = createDropdown();


                if (dropdown) {
                    // This needs to be on mouseup to allow button events to fire on mouse down.
                    $(document).on('mousedown', onDocumentClick);
                    $(document).on('closeAllDropdowns', () => {
                        dropdown.removeClass('animate-in');
                        dropdown.active = false;
                    });

                    // will revisit this later.
                    // dropdown.bind('oanimationend animationend webkitAnimationEnd', function() {
                    //   console.log('animation done');
                    // });
                }
            });
        },
    };
};
export default DropdownDirective;

import { commonDirectivesModule } from '../common-directives.module';
commonDirectivesModule.directive('plDropdown', ['$log', '$timeout', DropdownDirective]);
