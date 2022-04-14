/**
 * Misc language additions for the whiteboard
 *
 * @param $log
 */
const LanguageMixins = function($log) {

    /**
     * Add random access insertions to jquery dom elements
     *
     * @param index
     * @param $parent
     * @returns {*}
     */
    (<any>$.fn).insertAt = function(index, $parent) {
        return this.each(function() {
            if (index === 0) {
                $parent.prepend(this);
            } else {
                $parent.children().eq(index - 1).after(this);
            }
        });
    };

    /**
     *  Adds class (has, add, remove, toggle css class methods to SVGElement objects
     *
     *  from https://gist.github.com/branneman/8436956
     */
    if (SVGElement && SVGElement.prototype) {
        SVGElement.prototype.hasClass = function (className) {
            return new RegExp(`(\\s|^)${className}(\\s|$)`).test(this.getAttribute('class'));
        };

        SVGElement.prototype.addClass = function (className) {
            if (!this.hasClass(className)) {
                this.setAttribute('class', `${this.getAttribute('class')} ${className}`);
            }
        };

        SVGElement.prototype.removeClass = function (className) {
            const removedClass = this.getAttribute('class').replace(
                new RegExp(`(\\s|^)${className}(\\s|$)`, 'g'), '$2');
            if (this.hasClass(className)) {
                this.setAttribute('class', removedClass);
            }
        };

        SVGElement.prototype.toggleClass = function (className, state) {
            if (this.hasClass(className) || state === false) {
                this.removeClass(className);
            } else {
                this.addClass(className);
            }
        };
    }

};

import { whiteboardModule } from '../whiteboard.module';
whiteboardModule.service('languageMixins', ['$log', LanguageMixins]);
