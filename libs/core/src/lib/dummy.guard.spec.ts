import { TestBed, async, inject } from '@angular/core/testing';

import { DummyGuard } from './dummy.guard';

describe('DummyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DummyGuard]
    });
  });

  it('should ...', inject([DummyGuard], (guard: DummyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
