import "es6-promise";
import "isomorphic-fetch";
import parser from "xml2json";

export default class GoodreadsService {
  constructor(key, secret) {
    this.key = key;
    this.secret = secret;
  }

  async search(title, initPage = 1, numPages = 1) {
    const url = `https://www.goodreads.com/search.xml?key=${this.key}&q=${title}`;
    let promiseArray = [];

    for (let i = initPage; i < initPage + numPages; i++) {
      let promiseUrl = url + `&page=${i}`;
      promiseArray.push(fetch(promiseUrl));
    }

    let responses = await Promise.all(promiseArray);
    responses = responses.map((response) => response.text());

    let res = await Promise.all(responses);

    let jsonJS = res.map((e) => parser.toJson(e));
    jsonJS = jsonJS.map((e) => JSON.parse(e));

    const flatSingle = arr => [].concat(...arr);
    jsonJS = jsonJS.map((e) => e.GoodreadsResponse.search.results.work);
    jsonJS = flatSingle(jsonJS);
    
    return jsonJS;
  }
}