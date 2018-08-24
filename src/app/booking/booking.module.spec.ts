import { BookingModule } from './booking.module';

describe('BookingModule', () => {
  let bannersModule: BookingModule;

  beforeEach(() => {
    bannersModule = new BookingModule();
  });

  it('should create an instance', () => {
    expect(bannersModule).toBeTruthy();
  });
});
