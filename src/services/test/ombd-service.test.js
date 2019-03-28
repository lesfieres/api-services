import OmbdService from '../ombd-service';
const ombdService = new OmbdService('key');

describe('search', () => {
  const mockJPromise = Promise.resolve({});
  const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => mockJPromise);

  beforeEach(() => {
    fetchSpy.mockClear();
  });

  test('Call to api with only title should just search page 1', () => {
    ombdService.search("test");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://www.omdbapi.com?apikey=key&s=test&page=1');
  });

  test('Call to api with title + initial page should search for correct page', () => {
    ombdService.search("test", 5);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://www.omdbapi.com?apikey=key&s=test&page=5');
  });

  test('Call to api with title + initial page + number of pages should search for correct pages', () => {
    ombdService.search("test", 5, 3);

    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch).toHaveBeenCalledWith('https://www.omdbapi.com?apikey=key&s=test&page=5');
    expect(global.fetch).toHaveBeenCalledWith('https://www.omdbapi.com?apikey=key&s=test&page=6');
    expect(global.fetch).toHaveBeenCalledWith('https://www.omdbapi.com?apikey=key&s=test&page=7');
  });

  test('Call to api with only title should just search page 1', (done) => {
    const response1 = {
      Search: [
        { Title: "Title 1" }
      ]
    };

    const response2 = {
      Search: [
        { Title: "Title 2" }
      ]
    };

    const response3 = {
      Response: "False",
      Error: "Movie not found!"
    };

    const mockFetchPromise = Promise.resolve({
      json: () => response1,
    });

    const mockFetchPromise2 = Promise.resolve({
      json: () => response2,
    });

    const mockFetchPromise3 = Promise.resolve({
      json: () => response3,
    });

    const fetchSpy = jest.spyOn(global, 'fetch');
    fetchSpy.mockReturnValueOnce(mockFetchPromise);
    fetchSpy.mockReturnValueOnce(mockFetchPromise2);
    fetchSpy.mockReturnValueOnce(mockFetchPromise3);

    ombdService.search('test', 1, 3).then(function(books) {
      expect(books).toEqual([...response1.Search, ...response2.Search]);
      done();
    });
  });

  describe('getMovieInfo', () => {
    const response = {
      title: "title"
    }

    const mockJPromise = Promise.resolve({
      json: () => response,
    });
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => mockJPromise);

    beforeEach(() => {
      fetchSpy.mockClear();
    });

    test('Call to api with only id should be called with short plot', () => {
      ombdService.getMovieInfo("test");

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('https://www.omdbapi.com?apikey=key&i=test&plot=short');
    });

    test('Call to api with id and plot should be called with specific plot', () => {
      ombdService.getMovieInfo("test", "full");

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('https://www.omdbapi.com?apikey=key&i=test&plot=full');
    });

    test('Should return movie data in a json file', (done) => {
      ombdService.getMovieInfo("test").then(function(movie) {
        expect(movie).toEqual(response);
        done();
      });
    });
  });
});
