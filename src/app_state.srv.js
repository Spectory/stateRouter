/*globals angular, _ */
'use strict';
angular.module('app').factory('AppState', function () {
  var state;
  var service = {};
  var VALID_VAR_RGX = /[a-zA-Z_][a-zA-Z0-9_]*/;

  function invalid_def(def) {
    if (!def) { return true; }
    if (!def.name) { return true; }
    if (!VALID_VAR_RGX.test(def.name)) { return true; }
    return false;
  }

  function already_defined(key) {
    return _.includes(_.keys(state), key);
  }

  service.mockState = function (new_state) {
    state = new_state;
  };

  service.defineState = function (def) {
    if (invalid_def(def)) {throw [def, "is an invalid state definition"].join(' '); }
    if (already_defined(def.name)) {throw [def.name, "was already defined"].join(' '); }
    state[def.name] = undefined;
  };

  return service;
});