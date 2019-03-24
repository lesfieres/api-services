"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _goodreadsService = _interopRequireDefault(require("./goodreads-service"));

var _ombdService = _interopRequireDefault(require("./ombd-service"));

module.exports = {
  GoodreadsService: _goodreadsService.default,
  OmbdService: _ombdService.default
};