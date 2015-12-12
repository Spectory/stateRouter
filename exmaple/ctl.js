/*globals angular, _ */

angular.module('app').controller('ctl', ['$scope', 'StateService', function ($scope, StateService) {
  'use strict';

  $scope.init = function () {
    $scope.tabs = ['home', 'edit', 'settings'];
    $scope.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    $scope.StateService = StateService;
    StateService.defineState({name: 'selected_tab', validator: function (val) { return $scope.tabs.indexOf(val) >= 0; }});
    StateService.defineState({name: 'selected_num', validator: function (val) { return $scope.numbers.indexOf(val) >= 0; }});
  };
  $scope.selectTab = function (val) {
    StateService.set({name: 'selected_tab', value: val});
  };
  $scope.selectNum = function (val) { StateService.set({name: 'selected_num', value: val}); };

  $scope.getAppStateView = function () { $scope.state_view = StateService.view(); };

}]);
