import { GalleryModule } from './gallery.module';

describe('GalleryModule', () => {
  let gallerysModule: GalleryModule;

  beforeEach(() => {
    gallerysModule = new GalleryModule();
  });

  it('should create an instance', () => {
    expect(gallerysModule).toBeTruthy();
  });
});
