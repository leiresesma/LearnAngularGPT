import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { checkLoginGuard } from './check-login.guard';

describe('checkLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
