"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

require("es6-promise");

require("isomorphic-fetch");

var OmbdService =
/*#__PURE__*/
function () {
  function OmbdService(key) {
    (0, _classCallCheck2.default)(this, OmbdService);
    this.key = key;
  }

  (0, _createClass2.default)(OmbdService, [{
    key: "search",
    value: function () {
      var _search = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(title) {
        var initPage,
            numPages,
            url,
            promiseArray,
            i,
            promiseUrl,
            responses,
            movies,
            _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                initPage = _args.length > 1 && _args[1] !== undefined ? _args[1] : 1;
                numPages = _args.length > 2 && _args[2] !== undefined ? _args[2] : 1;
                // prettier-ignore
                url = "https://www.omdbapi.com?apikey=".concat(this.key, "&s=").concat(title);
                promiseArray = [];
                initPage = parseInt(initPage, 10);
                numPages = parseInt(numPages, 10);

                for (i = initPage; i < initPage + numPages; i++) {
                  promiseUrl = "".concat(url, "&page=").concat(i);
                  promiseArray.push(fetch(promiseUrl));
                }

                _context.prev = 7;
                _context.next = 10;
                return Promise.all(promiseArray).then(function (responses) {
                  return Promise.all(responses.map(function (response) {
                    return response.json();
                  }));
                }).then(function (responses) {
                  return Promise.all(responses.map(function (response) {
                    return response.Search;
                  }));
                });

              case 10:
                responses = _context.sent;
                movies = responses.reduce(function (movies, page) {
                  if (page) {
                    return [].concat((0, _toConsumableArray2.default)(movies), (0, _toConsumableArray2.default)(page));
                  } else {
                    return movies;
                  }
                }, []);
                return _context.abrupt("return", movies);

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](7);
                return _context.abrupt("return", []);

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[7, 15]]);
      }));

      function search(_x) {
        return _search.apply(this, arguments);
      }

      return search;
    }() // Plot => {'short' or 'full'}

  }, {
    key: "getMovieInfo",
    value: function () {
      var _getMovieInfo = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(id) {
        var plot,
            url,
            _args2 = arguments;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                plot = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 'short';
                // prettier-ignore
                url = "https://www.omdbapi.com?apikey=".concat(this.key, "&i=").concat(id, "&plot=").concat(plot);
                return _context2.abrupt("return", fetch(url).then(function (response) {
                  return response.json();
                }));

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getMovieInfo(_x2) {
        return _getMovieInfo.apply(this, arguments);
      }

      return getMovieInfo;
    }()
  }]);
  return OmbdService;
}();

exports.default = OmbdService;