import * as _ from 'lodash';
import * as angular from 'angular';
import { TweenLite } from 'gsap';
// import { $M } from 'sylvester';

declare var $M;
/**
 * ShapeController base class for shapes
 * @param $log
 * @param $scope
 * @constructor
 */
function getTransformToElement(element, target) {
    try {
        const mTargetInverse = target.getScreenCTM().inverse();
        return mTargetInverse.multiply(element.getScreenCTM());
    } catch (e) {
        throw new Error('"target" CTM is not invertible.');
    }
}

const ShapeController = function($log, $scope, $element, guidService) {

    this.modified = false;
    this.txnHash = null;

    this.setModified = function(value) {
        // $log.debug("[TransformController] setting modified: " + value);
        this.modified = value;
        this.txnHash = guidService.generateUUID();
    };

    this.isModified = function() {
        return this.modified;
    };

    this.isLocalModification = function(hash) {
        return this.txnHash === hash;
    };

    /*
    * Get the bounding box dimensions of the shape
    */
    this.getExtents = function() {
        // calculate the bounding box including the stroke width
        // yoinked from here:
        // http://stackoverflow.com/questions/10623809/get-bounding-box-of-element-accounting-for-its-transform
        const bb = $element[0].getBBox();
        // $log.debug("[ShapeController] element bb w: " + bb.width + " h: " + bb.height );

        // devnote: for reasons unknown, $element[0].parentNode will occasionally return a documentFragment instead of
        // the actual svg parent element. Since in this context the parentNode is always going to be svgContent (we
        // have no subgroup content)
        // we'll just use a reference to svgContent
        const m = getTransformToElement($element[0], $scope.whiteboardModel.svgContent[0]);

        // Create an array of all four points for the original bounding box
        const svg = $scope.whiteboardModel.svgRoot[0];
        const pts = [
            svg.createSVGPoint(), svg.createSVGPoint(),
            svg.createSVGPoint(), svg.createSVGPoint(),
        ];

        let strokeWidthMargin = 0;
        if ($scope.data.strokeWidth > 0) {
            strokeWidthMargin = $scope.data.strokeWidth / 2;
        }
        pts[0].x = bb.x - strokeWidthMargin;
        pts[0].y = bb.y - strokeWidthMargin;
        pts[1].x = bb.x + bb.width + strokeWidthMargin;
        pts[1].y = bb.y - strokeWidthMargin;
        pts[2].x = bb.x + bb.width + strokeWidthMargin;
        pts[2].y = bb.y + bb.height + strokeWidthMargin;
        pts[3].x = bb.x - strokeWidthMargin;
        pts[3].y = bb.y + bb.height + strokeWidthMargin;

        // Transform each into the space of the parent,
        // and calculate the min/max points from that.
        let xMin = Infinity;
        let xMax = -Infinity;
        let yMin = Infinity;
        let yMax = -Infinity;
        _.forEach(pts, (pt) => {
            pt = pt.matrixTransform(m);
            xMin = Math.min(xMin, pt.x);
            xMax = Math.max(xMax, pt.x);
            yMin = Math.min(yMin, pt.y);
            yMax = Math.max(yMax, pt.y);
        });

        // Update the bounding box with the new values
        bb.x = xMin;
        bb.y = yMin;
        bb.width  = xMax - xMin;
        bb.height = yMax - yMin;
        // $log.debug("[ShapeController] scope.data: " + JSON.stringify(this.getShapeVO()));
        // $log.debug("[ShapeController] getExtents() final bb w: " + bb.width + " h: " + bb.height );

        return bb;
    };

    /*
     * Get the bounding box dimensions of the shape
     */
    this.getNominalExtents = function() {
        const bb = this.getExtents();
        $log.debug(`[ShapeController] INITIAL getExtents() final bb w: ${bb.width} h: ${bb.height}`);
        return bb;
    };

    /**
     * Returns the data values as an object that define this shape.
     */
    this.getShapeVO = function() {
        const vo: any = {};
        angular.forEach($scope.data, (value, key:string) => {
            if (key.indexOf('$') === -1) {
                if (key === 'matrix') {
                    const elements = value.elements;
                    vo[key] = { elements };
                } else {
                    vo[key] = value;
                }
            }
        });
        vo.txnHash = this.txnHash;
        // $log.debug("[ShapeController] getShapeVO(): new vo: " + JSON.stringify(vo));
        return vo;
    };

    // use greensock to animate matrix changes
    this._tweenMatrix = function(newMatrix, duration) {
        const oldM = $M($scope.data.matrix.elements);

        // make the matrix assume a new object so that we don't override the tool's settings.
        $scope.data.matrix = $M($scope.data.matrix.elements);
        const newM = $M(newMatrix.elements);
        const t = new TweenLite({}, duration, {
            onStart() {
                // t.data.scene.add(this.data.particleSystem);
            },
            onUpdate() {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        const oldVal = oldM.elements[i][j];
                        const newVal = newM.elements[i][j];
                        const d = oldVal + (newVal - oldVal) * this.ratio;
                        $scope.data.matrix.elements[i][j] = d;
                    }
                }
                $scope.update();
                // $scope.$apply();
            },
            onComplete() {
            },

            // TODO - self-referential???
            // onUpdateScope: t
        });
        t.play();
    };

    /**
     * Animate vo onto the scope of this object
     */
    this.animateShapeVO = function(vo) {
        // $log.debug("[ShapeController] animateShapeVO(): old scope.data: " + JSON.stringify($scope.data));
        _.each(vo, (value, key) => {
            if (key === 'matrix') {
                const newMatrix = $M(value.elements);
                if (newMatrix.eql($scope.data.matrix) === false) {
                    this._tweenMatrix(newMatrix, 1);
                }

            } else {
                $scope.data[key] = value;
            }
        });
        $scope.update();
        // $log.debug("[ShapeController] animateShapeVO(): new scope.data: " + JSON.stringify($scope.data));
    };

    /**
     * Set vo onto the scope of this object
     */
    this.setShapeVO = function(vo) {
       // $log.debug("[ShapeController] setShapeVO(): old scope.data: " + JSON.stringify($scope.data));
        angular.forEach(vo, (value, key:string) => {
            if (key === 'matrix') {
                $scope.data.matrix = $M(value.elements);
            } else {
                $scope.data[key] = value;
            }
        });
        $scope.update();
       // $log.debug("[ShapeController] setShapeVO(): new scope.data: " + JSON.stringify($scope.data));
    };

    /**
     *  Method updates individual data properties of the shape
     */
    this.updateShapeProperty = function(type, value, deferred) {
        if (_.keys($scope.data).indexOf(type) > -1) {
            $scope.data[type] = value;
            const vo = this.getShapeVO();
            if (deferred) {
                this.setModified(true);
            } else {
                $scope.whiteboardModel.updateElement(vo);
            }
            $scope.update();
        }
    };

    this.equals = function(target) {
        $log.debug('[ShapeController] equals: ' + target);
        const vo = this.getShapeVO();
        let equals = false;
        _.forEach(vo, (value, key) => {
            if (key === 'matrix') {
                const newMatrix = $M(value.elements);
                if (newMatrix.eql(target.matrix) === false) {
                    equals = false;
                }
            } else {
                if (!_.isEqual(target[key], value)) {
                    equals = false;
                }
            }
        });
        return equals;
    };

    /**
     * Zero dimension shapes should not be drawn.
     * This can be overridden by subclasses
     * @returns {boolean}
     */
    this.validateShape = function() {
        if ($scope.data && $scope.data.width > 0 && $scope.data.height > 0) {
            return true;
        }
        return false;
    };

    // Set an optional mode on the shape
    this.getSvgElement = function() {
        return $element[0];
    };

    this.element = $element;

    /**
     *  Destroy the shape scope
     */
    this.destroyElement = function() {
        $scope.$destroy();
    };

    const init = function() {
        $log.debug('[ShapeController] creating ShapeController');
    };
    init();
};

import { shapesModule } from '../shapes.module';
shapesModule.controller('ShapeController', ['$log', '$scope', '$element', 'guidService', ShapeController]);
