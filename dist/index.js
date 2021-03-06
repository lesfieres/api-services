"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _goodreadsService = _interopRequireDefault(require("./services/goodreads-service"));

var _ombdService = _interopRequireDefault(require("./services/ombd-service"));

module.exports = {
  GoodreadsService: _goodreadsService.default,
  OmbdService: _ombdService.default
};