"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

require("es6-promise");

require("isomorphic-fetch");

var _xml2js = require("xml2js");

var parseBook = function parseBook(book) {
  var bestBook = book.best_book[0];
  return {
    id: book.id[0]['_'],
    best_book: {
      id: bestBook.id[0]['_'],
      title: bestBook.title[0],
      author: {
        id: bestBook.author[0].id[0]['_'],
        name: bestBook.author[0].name[0]
      },
      image_url: bestBook.image_url[0],
      small_image_url: bestBook.small_image_url[0]
    }
  };
};

var GoodreadsService =
/*#__PURE__*/
function () {
  function GoodreadsService(key, secret) {
    (0, _classCallCheck2.default)(this, GoodreadsService);
    this.key = key;
    this.secret = secret;
  }

  (0, _createClass2.default)(GoodreadsService, [{
    key: "getAllSeriesABookisIn",
    value: function () {
      var _getAllSeriesABookisIn = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(id) {
        var url, xmlSeriesResponse, textXmlSeriesResponse, jsonResponse;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // prettier-ignore
                url = "https://www.goodreads.com/work/".concat(id, "/series?format=xml&key=").concat(this.key);
                _context.next = 3;
                return fetch(url);

              case 3:
                xmlSeriesResponse = _context.sent;
                _context.next = 6;
                return xmlSeriesResponse.text();

              case 6:
                textXmlSeriesResponse = _context.sent;
                _context.next = 9;
                return new Promise(function (resolve) {
                  (0, _xml2js.parseString)(textXmlSeriesResponse, function (err, result) {
                    resolve(result);
                  });
                });

              case 9:
                jsonResponse = _context.sent;
                return _context.abrupt("return", jsonResponse.GoodreadsResponse.series_works[0].series_work);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getAllSeriesABookisIn(_x) {
        return _getAllSeriesABookisIn.apply(this, arguments);
      }

      return getAllSeriesABookisIn;
    }()
  }, {
    key: "search",
    value: function () {
      var _search = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(title) {
        var initPage,
            numPages,
            url,
            promiseArray,
            i,
            promiseUrl,
            responses,
            books,
            _args2 = arguments;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                initPage = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 1;
                numPages = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 1;
                // prettier-ignore
                url = "https://www.goodreads.com/search.xml?key=".concat(this.key, "&q=").concat(title);
                promiseArray = [];
                initPage = parseInt(initPage, 10);
                numPages = parseInt(numPages, 10);

                for (i = initPage; i < initPage + numPages; i++) {
                  promiseUrl = "".concat(url, "&page=").concat(i);
                  promiseArray.push(fetch(promiseUrl));
                }

                _context2.prev = 7;
                _context2.next = 10;
                return Promise.all(promiseArray).then(function (responses) {
                  return Promise.all(responses.map(function (response) {
                    return response.text();
                  }));
                }).then(function (responses) {
                  return Promise.all(responses.map(function (xmlResponse) {
                    return new Promise(function (resolve) {
                      (0, _xml2js.parseString)(xmlResponse, function (err, result) {
                        resolve(result);
                      });
                    });
                  }));
                });

              case 10:
                responses = _context2.sent;
                books = responses.map(function (object) {
                  return object.GoodreadsResponse.search[0].results[0].work;
                }).reduce(function (books, page) {
                  // return books.concat(page);
                  return [].concat((0, _toConsumableArray2.default)(books), (0, _toConsumableArray2.default)(page));
                }, []).map(function (book) {
                  return parseBook(book);
                });
                return _context2.abrupt("return", books);

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2["catch"](7);
                return _context2.abrupt("return", []);

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[7, 15]]);
      }));

      function search(_x2) {
        return _search.apply(this, arguments);
      }

      return search;
    }()
  }]);
  return GoodreadsService;
}();

exports.default = GoodreadsService;