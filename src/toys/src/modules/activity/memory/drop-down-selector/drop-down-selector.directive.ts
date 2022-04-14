let DropDownSelector;
DropDownSelector = function DropDownSelector() {
    return {
        restrict: 'E',
        replace: true,
        template: require('./drop-down-selector.directive.html'),
        scope: {
            mainTitle: '@',
            collection: '=',
            forceUpdate: '=',
        },
        link: ($scope) => {
            if (!$scope.collection) {
                $scope.collection = [];
            }

            let selectedItem = $scope.collection.filter($item => $item.selected)[0] || $scope.collection[0];

            if (!$scope.mainTitle) {
                $scope.mainTitle = selectedItem && selectedItem.text ? selectedItem.text : '';
            }

            $scope.showContent = false;
            $scope.checkboxId = Math.random();

            $scope.$collectionChanged = (newCollection) => {
                updateCollection(newCollection);
            };

            function updateCollection(newCollection) {
                newCollection.some((item) => {
                    if (item.selected) {
                        selectedItem = item;

                        $scope.$evalAsync(() => {
                            $scope.mainTitle = item.text;
                        });

                        return true;
                    }
                });
            }

            $scope.$watchCollection('collection', $scope.$collectionChanged);

            $scope.$watch('forceUpdate', () => {
                updateCollection($scope.collection);
            });

            $scope.toggleContent = ($event) => {
                if (!$scope.collection.length) {
                    return;
                }

                $scope.showContent = !$scope.showContent;

                $event.preventDefault();
                $event.stopPropagation();
            };

            $scope.select = ($item) => {
                $scope.showContent = false;

                if (!$item || selectedItem === $item) {
                    return ;
                }

                $scope.collection.forEach((item) => {
                    item.selected = $item === item;

                    if (item.selected) {
                        selectedItem = item;
                    }
                });

                $scope.mainTitle = $item.text;
                if (typeof $item.onChange === 'function') {
                    $item.onChange($item);
                }
            };
        },
    };
};

import * as angular from 'angular';

const dropDownSelector = angular.module('toys').directive('dropDownSelector', [
    DropDownSelector,
]);
