/*globals angular, _ */

// create the app
angular.module('app', ['StateRouter']);

// init the app with state validators
angular.module('app').run(function (StateService) {
  'use strict';
  var tabs = ['home', 'edit', 'settings'];
  var  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  StateService.defineState({name: 'selected_tab', validator: function (val) { return tabs.indexOf(val) >= 0; }});
  StateService.defineState({name: 'selected_num', validator: function (val) { return numbers.indexOf(parseInt(val, 10)) >= 0; }});
});

// define app modules
angular.module('app').controller('ctl', ['$scope', 'StateService', function ($scope, StateService) {
  'use strict';

  $scope.init = function () {
    $scope.tabs = ['home', 'edit', 'settings'];
    $scope.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    $scope.StateService = StateService;
  };
  $scope.selectTab = function (val) {
    StateService.set({name: 'selected_tab', value: val});
  };
  $scope.selectNum = function (val) { StateService.set({name: 'selected_num', value: val}); };

  $scope.isSelectedTab = function (i) {
    return $scope.tabs[i] === StateService.get('selected_tab');
  };

  $scope.isSelectedNum = function (i) {
    console.log(i, StateService.get('selected_num'));
    return $scope.numbers[i] === parseInt(StateService.get('selected_num'), 10);
  };

  $scope.getAppStateView = function () { $scope.state_view = StateService.view(); };

}]);
