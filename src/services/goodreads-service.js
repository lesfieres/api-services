import 'es6-promise';
import 'isomorphic-fetch';
import { parseString } from 'xml2js';

const parseBook = book => {
  const bestBook = book.best_book[0];
  return {
    id: book.id[0]['_'],
    best_book: {
      id: bestBook.id[0]['_'],
      title: bestBook.title[0],
      author: {
        id: bestBook.author[0].id[0]['_'],
        name: bestBook.author[0].name[0],
      },
      image_url: bestBook.image_url[0],
      small_image_url: bestBook.small_image_url[0],
    },
  };
};
export default class GoodreadsService {
  constructor(key, secret) {
    this.key = key;
    this.secret = secret;
  }

  async getAllSeriesABookIsIn(id) {
    // prettier-ignore
    const url = `https://www.goodreads.com/work/${id}/series?key=${this.key}`;
    try {
      const xmlSeriesResponse = await fetch(url);
      const textXmlSeriesResponse = await xmlSeriesResponse.text();

      const jsonResponse = await new Promise(resolve => {
        parseString(textXmlSeriesResponse, (err, result) => {
          resolve(result);
        });
      });
      
      return jsonResponse.GoodreadsResponse.series_works[0].series_work;
    } catch {
      return [];
    }
  }

  async search(title, initPage = 1, numPages = 1) {
    // prettier-ignore
    const url = `https://www.goodreads.com/search.xml?key=${this.key}&q=${title}`;
    let promiseArray = [];

    initPage = parseInt(initPage, 10);
    numPages = parseInt(numPages, 10);

    for (let i = initPage; i < initPage + numPages; i++) {
      let promiseUrl = `${url}&page=${i}`;
      promiseArray.push(fetch(promiseUrl));
    }

    try {
      let responses = await Promise.all(promiseArray)
        .then(responses =>
          Promise.all(responses.map(response => response.text())),
        )
        .then(responses =>
          Promise.all(
            responses.map(
              xmlResponse =>
                new Promise(resolve => {
                  parseString(xmlResponse, (err, result) => {
                    resolve(result);
                  });
                }),
            ),
          ),
        );

      let books = responses
        .map(object => object.GoodreadsResponse.search[0].results[0].work)
        .reduce((books, page) => {
          // return books.concat(page);
          return [...books, ...page];
        }, [])
        .map(book => parseBook(book));

      return books;
    } catch (e) {
      // console.error('error parsing the response');
      return [];
    }
  }
}
