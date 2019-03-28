import GoodreadsService from '../goodreads-service';
const goodreadsService = new GoodreadsService('key', 'secret');

describe('search', () => {
  const mockJPromise = Promise.resolve({});
  const fetchSpy = jest
    .spyOn(global, 'fetch')
    .mockImplementation(() => mockJPromise);

  beforeEach(() => {
    fetchSpy.mockClear();
  });

  test('Call to api with book id to get the series the book is in', () => {
    goodreadsService.getAllSeriesABookIsIn(1);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.goodreads.com/work/1/series?key=key',
    );
  });

  test('Call to api with only title should just search page 1', () => {
    goodreadsService.search('test');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.goodreads.com/search.xml?key=key&q=test&page=1',
    );
  });

  test('Call to api with title + initial page should search for correct page', () => {
    goodreadsService.search('test', 5);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.goodreads.com/search.xml?key=key&q=test&page=5',
    );
  });

  test('Call to api with title + initial page + number of pages should search for correct pages', () => {
    goodreadsService.search('test', 5, 3);

    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.goodreads.com/search.xml?key=key&q=test&page=5',
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.goodreads.com/search.xml?key=key&q=test&page=6',
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.goodreads.com/search.xml?key=key&q=test&page=7',
    );
  });

  test('Call to api with id to get the response of the all the series a book is in', done => {
    
    const expectedResponse = `
    <GoodreadsResponse>
      <series_works>
        <series_work>
          <id>1</id>
          <user_position>1</user_position>
          <series>
            <id>3</id>
            <title>test title</title>
            <description>test description</description>
            <note>test note</note>
            <series_works_count>10</series_works_count>
            <primary_work_count>10</primary_work_count>
            <numbered>true</numbered>
          </series>
        </series_work>
        <series_work>
          <id>2</id>
          <user_position>1</user_position>
          <series>
            <id>4</id>
            <title>test title2</title>
            <description>test description2</description>
            <note>test note2</note>
            <series_works_count>10</series_works_count>
            <primary_work_count>10</primary_work_count>
            <numbered>true</numbered>
          </series>
        </series_work>
      </series_works>
    </GoodreadsResponse>
    `;

    const jsonResponse = [
      {
        id: ['1'],
        user_position: ['1'],
        series: [
          {
            id: ['3'],
            title: ['test title'],
            description: ['test description'],
            note: ['test note'],
            series_works_count: ['10'],
            primary_work_count: ['10'],
            numbered: ['true'],
          },
        ],
      },
      {
        id: ['2'],
        user_position: ['1'],
        series: [
          {
          id: ['4'],
          title: ['test title2'],
          description: ['test description2'],
          note: ['test note2'],
          series_works_count: ['10'],
          primary_work_count: ['10'],
          numbered: ['true'],
          }
        ],
      },
    ];

    const mockTextPromise = Promise.resolve(expectedResponse);
    const mockFetchPromise = Promise.resolve({
      text: () => mockTextPromise,
    });

    const fetchSpy = jest.spyOn(global, 'fetch');
    fetchSpy.mockReturnValueOnce(mockFetchPromise);

    goodreadsService.getAllSeriesABookIsIn(1).then(function (result) {
      expect(result).toEqual(jsonResponse);
      done();
    });

  });

  test('Call to api with only title should just search page 1', done => {
    const response1 = `
      <GoodreadsResponse>
        <search>
          <results>
            <work>
              <id type="integer">1</id>
              <best_book type="Book">
                <id type="integer">1</id>
                <title>Book 1</title>
                <author>
                    <id type="integer">10</id>
                    <name>Author 1</name>
                </author>
                <image_url>image 1</image_url>
                <small_image_url>small image 1</small_image_url>
              </best_book>
            </work>
          </results>
        </search>
      </GoodreadsResponse>
    `;

    const response2 = `
      <GoodreadsResponse>
        <search>
          <results>
            <work>
              <id type="integer">2</id>
              <best_book type="Book">
                <id type="integer">2</id>
                <title>Book 2</title>
                <author>
                    <id type="integer">20</id>
                    <name>Author 2</name>
                </author>
                <image_url>image 2</image_url>
                <small_image_url>small image 2</small_image_url>
              </best_book>
            </work>
          </results>
        </search>
      </GoodreadsResponse>
    `;

    const jsonResponse = [
      {
        id: '1',
        best_book: {
          id: '1',
          title: 'Book 1',
          author: { id: '10', name: 'Author 1' },
          image_url: 'image 1',
          small_image_url: 'small image 1',
        },
      },
      {
        id: '2',
        best_book: {
          id: '2',
          title: 'Book 2',
          author: { id: '20', name: 'Author 2' },
          image_url: 'image 2',
          small_image_url: 'small image 2',
        },
      },
    ];

    const mockTextPromise = Promise.resolve(response1);
    const mockFetchPromise = Promise.resolve({
      text: () => mockTextPromise,
    });

    const mockTextPromise2 = Promise.resolve(response2);
    const mockFetchPromise2 = Promise.resolve({
      text: () => mockTextPromise2,
    });

    const fetchSpy = jest.spyOn(global, 'fetch');
    fetchSpy.mockReturnValueOnce(mockFetchPromise);
    fetchSpy.mockReturnValueOnce(mockFetchPromise2);

    goodreadsService.search('test', 1, 2).then(function(books) {
      expect(books).toEqual(jsonResponse);
      done();
    });
  });
});
