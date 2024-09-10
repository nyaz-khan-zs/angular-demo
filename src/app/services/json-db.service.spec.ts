import { TestBed } from '@angular/core/testing';

import { JsonDbService } from './json-db.service';

describe('JsonDbService', () => {
  let service: JsonDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
