import 'es6-promise';
import 'isomorphic-fetch';

export default class OmbdService {
  constructor(key) {
    this.key = key;
  }

  async search(title, initPage = 1, numPages = 1) {
    // prettier-ignore
    const url = `https://www.omdbapi.com?apikey=${this.key}&s=${title}`
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
          Promise.all(responses.map(response => response.json())),
        )
        .then(responses =>
          Promise.all(responses.map(response => response.Search)),
        );

      let movies = responses.reduce((movies, page) => {
        if (page) {
          return [...movies, ...page];
        } else {
          return movies;
        }
      }, []);

      return movies;
    } catch (e) {
      return [];
    }
  }
}
