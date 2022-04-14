import { propertyOf } from 'lodash';

let ActivityDrawerDirective;
ActivityDrawerDirective = function ActivityDrawerDirective(
    firebaseAppModel,
    activityService,
    assessmentService,
    appModel,
    currentUserModel,
    ngrxStoreService,
) {
    return {
        restrict: 'E',
        scope: {
            storeActivity: '=',
        },
        replace: true,
        template: require('./activity-drawer.directive.html'),
        link: (scope) => {
            const typeActivity = 'activity';
            const typeAssessment = 'assessment';
            const typeGame = 'game';
            const types = [typeActivity, typeAssessment, typeGame];
            const typeFieldName = 'type';
            const typeFieldNameStore = 'activity_type';
            const activityAssessmentFieldName = 'activity_type';
            const activityAssessmentFieldNameStore = 'resource_type';
            scope.showActivity = false;
            scope.currentService = null;
            scope.unavailable = false;
            scope.assessmentAccessDenied = false;

            const checkActivity = function() {
                if (appModel.app.store) {
                    return scope.storeActivity;
                }
                return firebaseAppModel.app.activeActivity;
            };

            const removeWatcher = scope.$watch(checkActivity, (activity) => {
                scope.showActivity = false;
                scope.unavailable = false;
                scope.assessmentAccessDenied = false;

                if (!activity) {
                    if (scope.currentService) {
                        scope.currentService.reset();
                    }
                    return;
                }
                const typeField = scope.storeActivity ? typeFieldNameStore : typeFieldName;
                const isActivity = (activity[activityAssessmentFieldName] === typeActivity ||
                    activity[activityAssessmentFieldNameStore] === typeActivity);
                const isGame = (activity[activityAssessmentFieldName] === typeGame ||
                    activity[activityAssessmentFieldNameStore] === typeGame);
                const isAssessment = (activity[activityAssessmentFieldName] === typeAssessment ||
                    activity[activityAssessmentFieldNameStore] === typeAssessment);

                const serviceData = scope.storeActivity ? angular.copy(activity) : activity;
                if (-1 !== types.indexOf(serviceData.activity_type)) {
                    serviceData.resource_type = serviceData.activity_type;
                }
                scope.activityType = propertyOf(activity)(typeField);

                if (!isGame) {
                    scope.currentService = isActivity ? activityService : assessmentService;
                    scope.currentService.startup(serviceData)
                        .then(() => {
                            scope.showActivity = true;
                        })
                        .catch(obj => {
                            if (isAssessment) {
                                ngrxStoreService.dispatch(
                                    AppActions.setCursorSharing({ isCursorShared: false, isToggleDisabled: true }),
                                );
                            }

                            const isPLProvider = currentUserModel.user
                                && currentUserModel.user.groups
                                && currentUserModel.user.groups.indexOf('Provider') > -1;

                            // PL providers get a specific error message on blocked assessment content
                            if (isPLProvider && isAssessment && obj.configErrorCode === 403) {
                                scope.assessmentAccessDenied = true;
                            } else {
                                scope.unavailable = true;
                            }
                        });
                } else {
                    scope.showActivity = true;
                }

                if (scope.storeActivity) {
                    removeWatcher();
                }
            });

            scope.$on('$destroy', () => {
                if (!scope.currentService) {
                    return;
                }
                scope.currentService.reset();
                scope.currentService = null;
            });
        },
    };
};

import * as angular from 'angular';
import { AppActions } from '@room/app/store';

const activityDrawer = angular.module('toys').directive('activityDrawer', [
    'firebaseAppModel',
    'activityService',
    'assessmentService',
    'appModel',
    'currentUserModel',
    'ngrxStoreService',
    ActivityDrawerDirective,
]);
