"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("es6-promise");

var _goodreadsService = _interopRequireDefault(require("./services/goodreads-service"));

var _ombdService = _interopRequireDefault(require("./services/ombd-service"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var config = _dotenv.default.config().parsed;

var goodreadsService = new _goodreadsService.default(config.GOODREADS_KEY, config.GOODREADS_SECRET);
var ombdService = new _ombdService.default(config.OMBD_KEY);
/*
goodreadsService.search('game', 1, 3).then(function(books) {
  console.log('BOOOKS', books);
});
*/

ombdService.search('ender', 1, 3).then(function (movies) {
  console.log('movies', movies);
});