/*globals angular, _, window */
'use strict';

angular.module('app').factory('StateService', function () {
  var state = {};
  var service = {};
  var VALIDATORS = {};
  var VALID_VAR_RGX = /[a-zA-Z_][a-zA-Z0-9_]*/;

  if (window.karma_running) {
    service.mockState = function (new_state) {
      state = new_state;
    };
  }

  function T() { return true; }

  function invalid_def(def) {
    if (!def) { return true; }
    if (!def.name) { return true; }
    if (!VALID_VAR_RGX.test(def.name)) { return true; }
    return false;
  }

  function valid_validator(v) {
    return typeof v === "function";
  }

  function already_defined(key) {
    return _.includes(_.keys(state), key);
  }

  service.defineState = function (def) {
    if (invalid_def(def)) {throw [def, "is an invalid state definition"].join(' '); }
    if (already_defined(def.name)) {throw [def.name, "was already defined"].join(' '); }
    if (def.validator && !valid_validator(def.validator)) {throw [def, "Invalid validator"].join(' '); }
    VALIDATORS[def.name] = def.validator || T;
    state[def.name] = undefined;
  };

  service.set = function (key_and_value) {
    var key = key_and_value.name;
    var val = key_and_value.value;
    if (!VALIDATORS[key](val)) {throw [val, "is an invalid value for", key].join(' '); }
    state[key] =  val;
  };

  service.get = function (key) {
    return state[key];
  };

  service.view = function () {
    return _.cloneDeep(state);
  };

  return service;
});