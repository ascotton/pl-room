/**
 * Returns exclude filter function
 *
 * @returns {Function}
 */
const ExcludeFilter = function() {
    /**
     * Filtering function. The first argument it takes is a source
     * array which should be filtered across others which are
     * bypassed as other arguments. All bypassed arguments expected to
     * be an arrays of object with id field defined.
     *
     * @param {{ id: string }[]} one - source collection of object with ids
     * @param {...{ id: string }[]} others - arrays of objects with ids to filter source array across
     */
    return function () {
        const args = Array.prototype.slice.call(arguments, 0);
        const one = args.shift();
        let filtered;
        const others = args.map((arg) =>
            arg instanceof Array ? arg : [arg]);

        if (!(one)) {
            return [];
        }

        if (!others.length) {
            return one;
        }

        filtered = one;

        others.forEach((another) => {
            const ids = another.map((item) => item.id);
            filtered = filtered.filter((item) => !~ids.indexOf(item.id));
        });

        return filtered;
    };
};

const excludeFilter = angular.module('toys').service('excludeFilter', [
    ExcludeFilter
]);
