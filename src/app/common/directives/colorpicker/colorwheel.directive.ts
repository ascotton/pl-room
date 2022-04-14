let ColorWheelDirective;

ColorWheelDirective = function ($log, hotkeys) {
    return {
        replace: true,
        restrict: 'AE',
        require: '^colorpicker',
        template: require('./colorwheel.directive.html'),
        link: ($scope, $element, $attr, controller) => {
            const colorpickerController = controller;

            const COLORS = ['#d7ec45', '#74b842', '#1b9dd2', '#1458fb', '#4615ab', '#9019b6', '#CF1EAD', '#FF6C98',
                '#af2056', '#fc3023', '#fb5f21', '#faa328', '#fbc42d', '#fefd50', '#F6E6B5', '#D0AD76', '#906740'];

            const INNER_COLORS = ['#747678', 'black', 'white', '#EDEEEF'];
            const canvas = $element.find('canvas');
            const ctx = canvas[0].getContext('2d');
            const center = {
                x: 100,
                y: 106,
            };
            const radius = 70;
            const centerRadius = 15;
            const strokeThickness = 40;

            const drawCenter = function (color) {
                ctx.beginPath();
                ctx.arc(center.x, center.y, centerRadius, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.fill();
            };

            const drawBasicWheel = function () {
                let segments = COLORS.length;
                let radOffset = 2 * Math.PI / segments / 2;
                let radsPerSeg = 2 * Math.PI / segments;
                for (let i = 0; i < segments; i++) {
                    const startRads = radOffset + i * radsPerSeg;
                    const endRads = radOffset + (i + 1) * radsPerSeg;
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, radius, startRads, endRads);
                    ctx.lineWidth = strokeThickness;
                    ctx.strokeStyle = COLORS[i];
                    ctx.stroke();
                }

                segments = INNER_COLORS.length;
                radOffset = 2 * Math.PI / segments / 2;
                radsPerSeg = 2 * Math.PI / segments;

                for (let i = 0; i < segments; i++) {
                    const startRads = radOffset + i * radsPerSeg;
                    const endRads = radOffset + (i + 1) * radsPerSeg;
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, 30, startRads, endRads);
                    ctx.lineWidth = strokeThickness;
                    ctx.strokeStyle = INNER_COLORS[i];
                    ctx.stroke();
                }

            };

            drawBasicWheel();

            const getColorUnderPt = function (x, y) {
                const canvasOffset = $(canvas).offset();
                const canvasX = Math.floor(x - canvasOffset.left);
                const canvasY = Math.floor(y - canvasOffset.top);

                // is the point in the center circle?
                const ptInCircle = Math.pow((canvasX - center.x), 2) + Math.pow((canvasY - center.y), 2) <=
                                    Math.pow(centerRadius, 2);
                if (ptInCircle) {
                    return 'transparent';
                }
                const imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
                const pixel = imageData.data;

                // Convert the pixel object into a color
                let hexColor = '#';
                for (let i = 0; i < 3; i++) {
                    let hexVal = pixel[i].toString(16);
                    hexVal = hexVal.length === 2 ? hexVal : `0${hexVal}`;
                    hexColor += hexVal;
                }
                return hexColor;
            };

            // this has to be in the wheel directive so it gets cleaned up correctly when the wheel is removed
            hotkeys.bindTo($scope)
                .add({
                    combo: 'escape',
                    callback: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        colorpickerController.setVisible(false);
                    },

                });

            $scope.canvasClicked = function (e) {
                e.preventDefault();
                e.stopPropagation();
                const color = getColorUnderPt(e.pageX, e.pageY);
                colorpickerController.setVisible(false);
                colorpickerController.setColor(color);
            };
        },
    };
};

import { commonDirectivesModule } from '../common-directives.module';

const colorWheelDirective = commonDirectivesModule.directive(
    'colorwheel',
    ['$log', 'hotkeys', ColorWheelDirective],
);
