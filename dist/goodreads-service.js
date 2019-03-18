'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

require('es6-promise');

require('isomorphic-fetch');

var _xml2js = require('xml2js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var flatSingle = function flatSingle(arr) {
	var _ref;

	return (_ref = []).concat.apply(_ref, (0, _toConsumableArray3.default)(arr));
};

var GoodreadsService = function () {
	function GoodreadsService(key, secret) {
		(0, _classCallCheck3.default)(this, GoodreadsService);

		this.key = key;
		this.secret = secret;
	}

	(0, _createClass3.default)(GoodreadsService, [{
		key: 'search',
		value: function () {
			var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(title) {
				var initPage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
				var numPages = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
				var url, promiseArray, i, promiseUrl, responses, jsonResults, books;
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								url = 'https://www.goodreads.com/search.xml?key=' + this.key + '&q=' + title;
								promiseArray = [];


								for (i = initPage; i < initPage + numPages; i++) {
									promiseUrl = url + '&page=' + i;

									promiseArray.push(fetch(promiseUrl));
								}

								_context.next = 5;
								return Promise.all(promiseArray).then(function (responses) {
									return Promise.all(responses.map(function (response) {
										return response.text();
									}));
								});

							case 5:
								responses = _context.sent;
								_context.next = 8;
								return Promise.all(responses.map(function (xmlResponse) {
									return new Promise(function (resolve) {
										(0, _xml2js.parseString)(xmlResponse, function (err, result) {
											resolve(result);
										});
									});
								}));

							case 8:
								jsonResults = _context.sent;
								books = jsonResults.map(function (object) {
									return object.GoodreadsResponse.search[0].results[0].work;
								}).reduce(function (books, page) {
									// return books.concat(page);
									return [].concat((0, _toConsumableArray3.default)(books), (0, _toConsumableArray3.default)(page));
								}, []);
								return _context.abrupt('return', books);

							case 11:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function search(_x3) {
				return _ref2.apply(this, arguments);
			}

			return search;
		}()
	}]);
	return GoodreadsService;
}();

exports.default = GoodreadsService;