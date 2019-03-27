import {GoodreadsService, OmbdService} from '../index';

describe('services instantiation', () => {
  it('should be possible to create a GoodreadsService', () => {
    const goodreadsService = new GoodreadsService('key', 'secret');
    expect(goodreadsService).toBeDefined();
  })

  it('should be possible to create an OmbdService', () => {
    const ombdService = new OmbdService('key');
    expect(ombdService).toBeDefined();
  })
});
