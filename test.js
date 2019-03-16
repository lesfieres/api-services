import 'es6-promise';
import GoodreadsService from './goodreads-service';
import env from 'dotenv';
let config = env.config().parsed;

let goodreadsService = new GoodreadsService(config.GOODREADS_KEY, config.GOODREADS_SECRET);

goodreadsService.search('game', 1, 3).then(function(books) {
	console.log('BOOOKS', books);
});
