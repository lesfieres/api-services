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

var _xml2js = require("xml2js");

var parseBook = function parseBook(book) {
  var bestBook = book.best_book[0];
  return {
    id: bestBook.id[0]['_'],
    title: bestBook.title[0],
    author: {
      id: bestBook.author[0].id[0]['_'],
      name: bestBook.author[0].name[0]
    },
    image_url: bestBook.image_url[0],
    small_image_url: bestBook.small_image_url[0]
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
            books,
            _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                initPage = _args.length > 1 && _args[1] !== undefined ? _args[1] : 1;
                numPages = _args.length > 2 && _args[2] !== undefined ? _args[2] : 1;
                // prettier-ignore
                url = "https://www.goodreads.com/search.xml?key=".concat(this.key, "&q=").concat(title);
                promiseArray = [];
                initPage = parseInt(initPage, 10);
                numPages = parseInt(numPages, 10);

                for (i = initPage; i < initPage + numPages; i++) {
                  promiseUrl = "".concat(url, "&page=").concat(i);
                  promiseArray.push(fetch(promiseUrl));
                }

                _context.next = 9;
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

              case 9:
                responses = _context.sent;
                books = responses.map(function (object) {
                  return object.GoodreadsResponse.search[0].results[0].work;
                }).reduce(function (books, page) {
                  // return books.concat(page);
                  return [].concat((0, _toConsumableArray2.default)(books), (0, _toConsumableArray2.default)(page));
                }, []).map(function (book) {
                  return parseBook(book);
                });
                return _context.abrupt("return", books);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function search(_x) {
        return _search.apply(this, arguments);
      }

      return search;
    }()
  }]);
  return GoodreadsService;
}();

exports.default = GoodreadsService;