import 'es6-promise';
import 'isomorphic-fetch';
import parser from 'xml2json';

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
			promiseArray.push(fetch(promiseUrl));
		}

		let responses = await Promise.all(promiseArray).then((responses) =>
			Promise.all(responses.map((response) => response.text()))
		);

		let books = responses
			.map((xmlResponse) => parser.toJson(xmlResponse))
			.map((jsonResponse) => JSON.parse(jsonResponse))
			.map((object) => object.GoodreadsResponse.search.results.work)
			.reduce((books, page) => {
				// return books.concat(page);
				return [ ...books, ...page ];
			}, []);

		return books;
	}
}
