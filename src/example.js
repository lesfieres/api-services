import 'es6-promise';
import GoodreadsService from './services/goodreads-service';
import OmbdService from './services/ombd-service';
import env from 'dotenv';
let config = env.config().parsed;

let goodreadsService = new GoodreadsService(
  config.GOODREADS_KEY,
  config.GOODREADS_SECRET,
);

let ombdService = new OmbdService(config.OMBD_KEY);

/*
goodreadsService.search('game', 1, 3).then(function(books) {
  console.log('BOOOKS', books);
});
*/

/*
ombdService.search('ender', 1, 3).then(function(movies) {
  console.log('movies', movies);
});
*/

ombdService.getMovieInfo('tt0944947', 'full').then(function(movie) {
  console.log('movie', movie);
});