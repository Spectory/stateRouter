/*global angular, _, inject, describe, beforeEach, expect, it */
'use strict';
describe('StateService,', function () {
  var service, state;

  beforeEach(angular.mock.module('app'));

  beforeEach(angular.mock.inject(function (StateService) {
    service = StateService;
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

        it(', should throw error if attribute was already defined', function () {
          service.defineState({name: 'selected_header_tab'});
          var test = function () {service.defineState({name: 'selected_header_tab'}); };
          expect(test).toThrow();

        });
      });

      describe(', defenition with name and validator function', function () {
        var dummyValidator = function () { return true; };
        it(', should define a state attribute by given name', function () {
          service.defineState({name: 'selected_header_tab', validator: dummyValidator});
          expect(state.selected_header_tab).toBe(undefined);
        });
      });
    });

    describe(', invalud inputs', function () {

      it(', should raise error when given state attribute is not a non empty String', function () {
        var invalid_attrs = [
          1,
          null,
          undefined,
          {},
          '',
          '    string_that_start_with_spaceing',
          '1123',
          '3string_that_start_with_numbers',
          'string with spaces',
          {name: 'valid_name', validator: 'notAfunction'}
        ];
        var tests = _.map(invalid_attrs, function (a) {
          return function () { service.defineState(a); };
        });
        _.forEach(tests, function (t) { expect(t).toThrow(); });
      });

    });
  });

  describe('set', function () {
    describe('when validator was not defined', function () {
      beforeEach(function () {
        service.defineState({name: 'selected_header_tab'});
      });
      it('should accept any value', function () {
        var vals = [1, "", null, 'home'];
        _.forEach(vals, function (v) {
          service.set({name: 'selected_header_tab', value: v});
          expect(state.selected_header_tab).toEqual(v);
        });
      });
    });

    describe('when validator was defined', function () {
      beforeEach(function () {
        var validator = function (x) {
          var acceptable_values = ['home', 'settings', 'admin'];
          return acceptable_values.indexOf(x) >= 0;
        };
        service.defineState({name: 'selected_header_tab', validator: validator});
      });

      it('should accept value when is valid', function () {
        service.set({name: 'selected_header_tab', value: 'home'});
        expect(state.selected_header_tab).toEqual('home');
      });

      it('should reject value when is invalid', function () {
        var test = function () { service.set({name: 'selected_header_tab', value: 'somthing else'}); };
        expect(test).toThrow();
      });
    });
  });

});

