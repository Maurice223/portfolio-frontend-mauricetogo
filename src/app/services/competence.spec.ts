import { TestBed } from '@angular/core/testing';

import { Competence } from './competence';

describe('Competence', () => {
  let service: Competence;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Competence);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
