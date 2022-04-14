const PLQuickAddDirective = function(appModel, drfActivityModel, currentUserModel) {
    return {
        restrict: 'E',
        replace: true,
        scope: {

        },
        template : require('./pl-quick-add.directive.html'),
        link: function(scope, element, attr){
            const initialize = function() {
                scope.favorites = new drfActivityModel.Collection();
                scope.favorites.$clear();
                scope.favorites.$filter({
                    'disabled': false,
                    'private': false,
                    'favorite__user__id': currentUserModel.user.id
                });
                scope.favorites.$fetch().then(function() {
                    scope.fetched = true;
                });
            };

            initialize();
        }
    };
};

import { PLQueueModule } from '../pl-queue.module';

PLQueueModule.directive('plQuickAdd', [
    'appModel', 'drfActivityModel', 'currentUserModel',
    PLQuickAddDirective
]);
