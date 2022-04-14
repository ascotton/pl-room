const dummyLineForPath = 1;
function ActivityTypeIconDirective() {
    return {
        restrict: 'E',
        template: require('./activity-type-icon.directive.html'),
        scope: {
            activity: '='
        },
        link: function() {
        }
    };
};

import { commonDirectivesModule } from '../common-directives.module';
commonDirectivesModule.directive('activityTypeIcon', [ActivityTypeIconDirective]);
