import { TimelineLite } from 'gsap/all';

function Takeover($timeout) {
    return {
        replace: true,
        transclude: true,
        template: require('./takeover.directive.html'),
        scope: {
            activated: '=',
            dismissable: '=',
            animation: '@',
            classBody: '@'
        },
        link: function (scope, element, attrs, controller) {
            const modal = element.find('.modal');
            let lastOffset = 0;
            const defaultAnimation = 'standard';
            if (!scope.animation) {
                scope.animation = defaultAnimation;
            }

            const openTimeline = new TimelineLite();
            const closeTimeline = new TimelineLite();

            const dismiss = function() {
                scope.activated = false;
                scope.$apply();
            };
            const onKeyup = function(e) {
                if (e.keyCode === 27) { dismiss(); }
            };
            const backgroundClicked = function(e) {

                if (!scope.$parent.backgroundClickDisabled) {
                    if (e.target === this || $(e.target).hasClass('dismiss')) {
                        dismiss();
                    }
                }

            };

            scope.closePopup = function() {
                scope.activated = false;
            };

            scope.$watch('activated', function() {
                scope.activated ? openModal() : closeModal();
            });

            function getCenteredTransform() {
                const eleHeight = modal.height();
                const windowHeight = $(window).height();
                return (windowHeight - eleHeight) / 2;
            }

            function setOffsetToTranslate3d(offset) {
                return 'translate3d(0, ' + offset + 'px, 0)';
            }

            let timer = null;
            function updateTransform() {
                if (timer) {
                    $timeout.cancel(timer);
                }

                timer = $timeout(function () {
                    const offset = getCenteredTransform();

                    if (lastOffset === offset || offset < 0) {
                        return;
                    }

                    lastOffset = offset;

                    modal.css({
                        transform: setOffsetToTranslate3d(offset)
                    });

                }, 50);
            }

            function showWithoutAnimation() {
                element.css({
                    opacity: 1
                });
                element.fadeIn();
                updateTransform();
            }

            function showWithAnimation() {
                element.show();
                const transfomr3d = setOffsetToTranslate3d(getCenteredTransform());
                closeTimeline.stop().clear();
                openTimeline
                    .clear()
                    .to(element, 0.25, { opacity: 1 })
                    .to(modal, 0.5, { transform:  transfomr3d}, 0)
                    .play(0);
            }

            function openModal() {
                if (scope.dismissable) {
                    $(document).on('keyup', onKeyup);
                    element.on('click', backgroundClicked);
                }
                modal.on('DOMSubtreeModified', updateTransform);
                if (scope.animation === defaultAnimation) {
                    showWithAnimation();
                    return;
                }
                showWithoutAnimation();
            }

            function closeWithAnimation() {
                openTimeline.stop().clear();
                closeTimeline
                    .clear()
                    .to(modal, 0.35, { transform: 'translate3d(0, -400px, 0)' })
                    .to(element, 0.2, { opacity: 0 })
                    .call(function() { this.hide(); }, [], element)
                    .play(0);
                scope.$emit('takeoverClosed');
            }

            function closeWithoutAnimation() {
                element.fadeOut();
                scope.$emit('takeoverClosed');
            }

            function closeModal() {
                if (scope.dismissable) {
                    $(document).off('keyup', onKeyup);
                    element.off('click', backgroundClicked);
                }
                modal.off('DOMSubtreeModified');
                if (scope.animation === defaultAnimation) {
                    closeWithAnimation();
                    return;
                }
                closeWithoutAnimation();
            }
        }
    };
}

import { commonDirectivesModule } from '../common-directives.module';
const takeover = commonDirectivesModule.directive('takeover', ['$timeout', Takeover]);
