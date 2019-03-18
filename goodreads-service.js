import 'es6-promise';
import 'isomorphic-fetch';
import {parseString} from 'xml2js';

const flatSingle = (arr) => [].concat(...arr);
export default class GoodreadsService {
	constructor(key, secret) {
		this.key = key;
		this.secret = secret;
	}

	async search(title, initPage = 1, numPages = 1) {
		const url = `https://www.goodreads.com/search.xml?key=${this.key}&q=${title}`;
		let promiseArray = [];

		for (let i = initPage; i < initPage + numPages; i++) {
			let promiseUrl = `${url}&page=${i}`;
			promiseArray.push(fetch(promiseUrl, {mode: 'cors'}));
		}

		let responses = await Promise.all(promiseArray).then((responses) =>
			Promise.all(responses.map((response) => response.text()))
		);

		let jsonResults = await Promise.all(responses
			.map((xmlResponse) => {
				return new Promise((resolve) => {
					parseString(xmlResponse, function (err, result) {
						resolve(result);
					});
				})
			}));

		let books = jsonResults
			.map((object) => object.GoodreadsResponse.search[0].results[0].work)
			.reduce((books, page) => {
				// return books.concat(page);
				return [ ...books, ...page ];
			}, []);

		return books;
	}
}
