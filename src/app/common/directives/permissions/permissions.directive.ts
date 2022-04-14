/**
 * Copied from Angular
 * https://github.com/angular/angular.js/blob/d077966ff1ac18262f4615ff1a533db24d4432a7/src/Angular.js
 * TODO: Is this the best Idea? Should we be doing something else??
 * Return the DOM siblings between the first and last node in the given array.
 * @param {Array} array like object
 * @returns {Array} the inputted object or a jqLite collection containing the nodes
 */
function getBlockNodes(nodes) {
  // TODO(perf): update `nodes` instead of creating a new object?
    let node = nodes[0];
    const endNode = nodes[nodes.length - 1];
    let blockNodes;

    for (let i = 1; node !== endNode && (node = node.nextSibling); i++) {
        if (blockNodes || nodes[i] !== node) {
            if (!blockNodes) {
                blockNodes = $(Array.prototype.slice.call(nodes, 0, i));
            }
            blockNodes.push(node);
        }
    }

    return blockNodes || nodes;
}

/**
 * Notice, see https://github.com/angular/angular.js/blob/master/src/ng/directive/ngIf.js#L3
 * this code is a duplicate of ng-if.
 *
 * TODO: Is this the best Idea? Should we be doing something else??
 *
 * @param {[type]} $log             [description]
 * @param {[type]} $animate         [description]
 * @param {[type]} currentUserModel [description]
 */
function PermissionsDirective($log, $animate, currentUserModel) {
    const PERMS_DEFAULT_PROVIDERS = 'Therapist || Administrator || School Staff Providers || Private Practice';
    const PERMS_ALL_NONSTUDENTS =
        'Observer || Therapist || Administrator || School Staff Providers || Private Practice';
    const PERMS_STUDENTS = 'Student';
    const PERMS_PL_PROVIDER = 'Therapist';
    const PERMS_PLATFORM_PROVIDERS = 'School Staff Providers || Private Practice';
    return {
        multiElement: true,
        transclude: 'element',
        priority: 601,
        terminal: true,
        restrict: 'A',
        $$tlb: true,
        link: function($scope, $element, $attr, ctrl, $transclude) {
            let block, childScope, previousElements;
            const permExpression = $attr.permissions;

            $scope.$watch(
                () => {
                    let exp = $attr.permissions;
                    if (currentUserModel.user) {
                        exp += JSON.stringify(currentUserModel.user.groups);
                    }
                    return exp;
                },
                () => {
                    let value = $attr.permissions;
                    let isPermitted = false;

                    if (value === 'PERMS_DEFAULT_PROVIDERS') {
                        value = PERMS_DEFAULT_PROVIDERS;
                    }
                    if (value === 'PERMS_ALL_NONSTUDENTS') {
                        value = PERMS_ALL_NONSTUDENTS;
                    }
                    if (value === 'PERMS_STUDENTS') {
                        value = PERMS_STUDENTS;
                    }
                    if (value === 'PERMS_PL_PROVIDER') {
                        value = PERMS_PL_PROVIDER;
                    }
                    if (value === 'PERMS_PLATFORM_PROVIDERS') {
                        value = PERMS_PLATFORM_PROVIDERS;
                    }

                    const groups = value.split('||');
                    groups.forEach((group) => {
                        if (!isPermitted) {
                            isPermitted = currentUserModel.user.isInGroup(group.trim());
                        }
                    });

                    if (isPermitted) {
                        if (!childScope) {
                            $transclude(
                                (clone, newScope) => {
                                    childScope = newScope;
                                    clone[clone.length++] =
                                        document.createComment(' end permissions: ' + $attr.permissions + ' ');
                                    // Note: We only need the first/last node of the cloned nodes.
                                    // However, we need to keep the reference to the jqlite wrapper
                                    // as it might be changed later  by a directive with templateUrl
                                    // when its template arrives.
                                    block = {
                                        clone: clone
                                    };
                                    $animate.enter(clone, $element.parent(), $element);
                                }
                            );
                        }
                    } else {
                        if (previousElements) {
                            previousElements.remove();
                            previousElements = null;
                        }
                        if (childScope) {
                            childScope.$destroy();
                            childScope = null;
                        }
                        if (block) {
                            previousElements = getBlockNodes(block.clone);
                            $animate.leave(previousElements).then(
                                () => {
                                    previousElements = null;
                                },
                            );
                            block = null;
                        }
                    }
                },
            );
        },
    };
}

import { commonDirectivesModule } from '../common-directives.module';
const permissions = commonDirectivesModule.directive('permissions', ['$log', '$animate', 'currentUserModel', (<any>PermissionsDirective)
]);

