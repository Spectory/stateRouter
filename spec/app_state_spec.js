/*global window, angular, _, inject, describe, beforeEach, expect, it */
'use strict';
window.karma_running = true;
describe('StateService,', function () {
  var service, state;

  beforeEach(angular.mock.module('state_router'));

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
        it(', should define a default state validator by given name', function () {
          service.defineState({name: 'selected_header_tab'});
          expect(service.VALIDATORS.selected_header_tab).toBeDefined();
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

  describe('isValidState', function () {
    beforeEach(function () {
      function gtZero(x) { return x > 0; }
      service.defineState({name: 'number', validator: gtZero});
    });
    describe('when state is valid', function () {
      it('should return true', function () {
        var valid_state = {'number': 4};
        expect(service.isValidState(valid_state)).toBe(true);
      });
    });
    describe('when state is invalid', function () {
      it('should return false', function () {
        var valid_state = {'number': -1};
        expect(service.isValidState(valid_state)).toBe(false);
      });
      it('should return false', function () {
        var valid_state = {'never_defined': 'some value'};
        expect(service.isValidState(valid_state)).toBe(false);
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

    describe('get', function () {
      beforeEach(function () {
        service.defineState({name: 'a'});
      });
      describe('when primitive value was set', function () {
        it('should return the value', function () {
          service.set({name: 'a', value: 5});
          expect(service.get('a')).toBe(5);
        });
      });
      describe('when reference value was set', function () {
        it('should return cloned object', function () {
          var ref_obj = {some: 'object'};
          service.set({name: 'a', value: ref_obj});
          expect(service.get('a')).toEqual(ref_obj);
          expect(service.get('a').some).not.toBe(ref_obj);
        });
      });
    });
  });

  describe('change', function () {
    var change_set;
    beforeEach(function () {
      function validator(sub) {
        return _.intersection(_.keys(sub), ['sub_1', 'sub_2', 'sub_3', 'sub_5']).length <= 4;
      }
      service.defineState({name: 'header'});
      service.defineState({name: 'sub', validator: validator});
      service.defineState({name: 'empty'});
      service.set({name: 'header', value: 'home'});
      service.set({name: 'sub', value: {sub_1: 'sub_1', sub_2: 'sub_2', sub_3: {sub_4: 'sub_4'}}});
      change_set = {
        header: 'new_header',
        sub: {sub_2: 'sub_2_new_value', sub_3: {sub_4: 'sub_4_new_value'}, sub_5: 'sub_5_new_value'},
        empty: 'not empty any more'
      };
    });

    describe('when input is valid', function () {
      it('should change / add only attributes', function () {
        service.change(change_set);
        expect(service.get('header')).toEqual('new_header');
        expect(service.get('sub').sub_1).toEqual('sub_1');
        expect(service.get('sub').sub_2).toEqual('sub_2_new_value');
        expect(service.get('sub').sub_3.sub_4).toEqual('sub_4_new_value');
        expect(service.get('sub').sub_5).toEqual('sub_5_new_value');
        expect(service.get('empty')).toEqual('not empty any more');
      });
    });
    describe('when the new state invalid', function () {
      it('should throw error', function () {
        change_set.sub_6 = 'not a valid sub';
        var test = function () { service.change(change_set); };
        expect(test).toThrow();
      });
    });
  });

  describe('save and load', function () {

  });
});

describe('StateKeeper', function () {
  var service;
  beforeEach(angular.mock.module('state_router'));

  beforeEach(angular.mock.inject(function (StateKeeper) {
    service = StateKeeper;
  }));

  it('should be defined', function () {
    expect(service).toBeDefined();
    expect(service.SAVED_STATES).toBeDefined();
  });

  describe('save', function () {
    var initial_state;
    beforeEach(function () {
      initial_state = {selected_tab: 'Home'};
      service.save({init: initial_state});
    });
    it('should cloned into SAVED_STATES given object under the given key', function () {
      expect(service.SAVED_STATES.init).toEqual(initial_state);
      expect(service.SAVED_STATES.init).not.toBe(initial_state);
    });
    it('should override when saved under the same key', function () {
      var other_state = {selected_tab: 'not Home tab'};
      service.save({init: other_state});
      expect(service.SAVED_STATES.init).toEqual(other_state);
      expect(service.SAVED_STATES.init).not.toBe(other_state);
    });
  });

  describe('load', function () {
    it('should return a cloned object', function () {
      var saved_state = {some_attr: 'some value'};
      service.SAVED_STATES.some_state = saved_state;
      var res = service.load('some_state');
      expect(res).toEqual(saved_state);
      expect(res).not.toBe(saved_state);
    });
  });
});
