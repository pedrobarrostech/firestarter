import { EventGalleryModule } from './event-gallery.module';

describe('EventGalleryModule', () => {
  let gallerysModule: EventGalleryModule;

  beforeEach(() => {
    gallerysModule = new EventGalleryModule();
  });

  it('should create an instance', () => {
    expect(gallerysModule).toBeTruthy();
  });
});
