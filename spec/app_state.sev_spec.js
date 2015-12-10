/*global angular, _, inject, describe, beforeEach, expect, it */
'use strict';
describe('AppState,', function () {
  var service, state;

  beforeEach(angular.mock.module('app'));

  beforeEach(angular.mock.inject(function (AppState) {
    service = AppState;
    state = {};
    service.mockState(state);
  }));

  it('should be defined', function () {
    expect(service).toBeDefined();
  });

  describe(', defineState', function () {

    describe(', valid inputs', function () {
      describe('defenition with name only', function () {
        it(', should define a state attribute by given name', function () {
          service.defineState({name: 'selected_header_tab'});
          expect(state.selected_header_tab).toBe(undefined);
        });
        it(', should define a state attribute by given name', function () {
          var dummyValidator = function () { return true; };
          service.defineState({name: 'selected_header_tab', validator: dummyValidator});
          expect(state.selected_header_tab).toBe(undefined);
        });
        it(', should throw error if attribute was already defined', function () {
          var dummyValidator = function () { return true; };
          service.defineState({name: 'selected_header_tab', validator: dummyValidator});
          var test = function () {service.defineState({name: 'selected_header_tab'}); };
          expect(test).toThrow();
        });
      });
    });

    describe(', invalud inputs', function () {
      it(', should raise error when given state attribute is not a non empty String', function () {
        var invalid_attrs = [1, null, {}, undefined, ''];
        var tests = _.map(invalid_attrs, function (a) {
          return function () { service.defineState(a); };
        });
        _.forEach(tests, function (t) { expect(t).toThrow(); });
      });
    });
  });

});

// var validator = function (x) {
//   var acceptable_values = ['home', 'settings', 'admin'];
//   return acceptable_values.indexOf(x) >= 0;
// };
