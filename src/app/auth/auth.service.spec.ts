import { TestBed } from '@angular/core/testing';
import {  HttpClient,  provideHttpClient,  withInterceptors } from '@angular/common/http';
import {  HttpTestingController,  provideHttpClientTesting,} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { logout } from '../state/user/user.actions';
import { environment } from '../../environments/environment';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let storeSpy: jasmine.SpyObj<Store>;

  const API_URL = `${environment.apiUrl}/data`;
  const EXTERNAL_URL = 'https://cdn.example.com/audio.m3u8';

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getToken',
      'refreshAccessToken',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Store, useValue: storeSpy },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should NOT add Authorization header for non-API (external) URLs', () => {
    authServiceSpy.getToken.and.returnValue('any-token');

    httpClient.get(EXTERNAL_URL).subscribe();

    const httpReq = httpMock.expectOne(EXTERNAL_URL);
    expect(httpReq.request.headers.has('Authorization')).toBeFalse();
    expect(authServiceSpy.getToken).not.toHaveBeenCalled();
    httpReq.flush({});
  });

  it('should add "Authorization: Bearer <token>" for API URLs when a token exists', () => {
    authServiceSpy.getToken.and.returnValue('valid-token');

    httpClient.get(API_URL).subscribe();

    const httpReq = httpMock.expectOne(API_URL);
    expect(httpReq.request.headers.get('Authorization')).toBe('Bearer valid-token');
    httpReq.flush({});
  });

  it('should NOT add Authorization header for API URLs when there is no token', () => {
    authServiceSpy.getToken.and.returnValue(null);

    httpClient.get(API_URL).subscribe();

    const httpReq = httpMock.expectOne(API_URL);
    expect(httpReq.request.headers.has('Authorization')).toBeFalse();
    httpReq.flush({});
  });

  it('should pass non-401 errors through untouched (no refresh attempt)', () => {
    authServiceSpy.getToken.and.returnValue('valid-token');

    let capturedStatus = 0;
    httpClient.get(API_URL).subscribe({
      error: (err) => (capturedStatus = err.status),
    });

    httpMock.expectOne(API_URL).flush(
      { detail: 'not found' },
      { status: 404, statusText: 'Not Found' }
    );

    expect(capturedStatus).toBe(404);
    expect(authServiceSpy.refreshAccessToken).not.toHaveBeenCalled();
  });

  it('should refresh on 401, then retry the original request with the new token', () => {
    authServiceSpy.getToken.and.returnValue('expired-token');
    authServiceSpy.refreshAccessToken.and.returnValue(
      of({ access: 'new-token' } as any)
    );

    let responseBody: any = null;
    httpClient.get(API_URL).subscribe((res) => (responseBody = res));
    httpMock
      .expectOne(API_URL)
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    // Retry carries the refreshed token
    const retryReq = httpMock.expectOne(API_URL);
    expect(retryReq.request.headers.get('Authorization')).toBe('Bearer new-token');
    retryReq.flush({ data: 'ok' });

    expect(responseBody).toEqual({ data: 'ok' });
    expect(authServiceSpy.refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(storeSpy.dispatch).not.toHaveBeenCalled();
  });

  // --- Refresh lifecycle: failure -----------------------------------------

  it('should dispatch logout() and navigate to /login when refresh fails', () => {
    authServiceSpy.getToken.and.returnValue('expired-token');
    authServiceSpy.refreshAccessToken.and.returnValue(
      throwError(() => new Error('refresh failed'))
    );

    let erroredOut = false;
    httpClient.get(API_URL).subscribe({
      error: () => (erroredOut = true),
    });

    httpMock
      .expectOne(API_URL)
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(erroredOut).toBeTrue();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(logout());
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  // --- Refresh guard: token/refresh call itself ---------------------------

  it('should NOT attempt to refresh when the failing 401 is the token/refresh call', () => {
    authServiceSpy.getToken.and.returnValue('expired-token');

    let capturedStatus = 0;
    httpClient
      .post(`${environment.apiUrl}/token/refresh`, {})
      .subscribe({ error: (err) => (capturedStatus = err.status) });

    httpMock
      .expectOne(`${environment.apiUrl}/token/refresh`)
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(capturedStatus).toBe(401);
    expect(authServiceSpy.refreshAccessToken).not.toHaveBeenCalled();
  });

  // --- Concurrent requests during a single refresh ------------------------

  it('should queue concurrent 401s and replay them once with the refreshed token', () => {
    authServiceSpy.getToken.and.returnValue('expired-token');
    authServiceSpy.refreshAccessToken.and.returnValue(
      of({ access: 'new-token' } as any)
    );

    const urlA = `${environment.apiUrl}/a`;
    const urlB = `${environment.apiUrl}/b`;

    let bodyA: any = null;
    let bodyB: any = null;
    httpClient.get(urlA).subscribe((res) => (bodyA = res));
    httpClient.get(urlB).subscribe((res) => (bodyB = res));

    // Both first attempts fail with 401
    httpMock.expectOne(urlA).flush({}, { status: 401, statusText: 'Unauthorized' });
    httpMock.expectOne(urlB).flush({}, { status: 401, statusText: 'Unauthorized' });

    // Refresh should happen only once for the pair
    expect(authServiceSpy.refreshAccessToken).toHaveBeenCalledTimes(1);

    // Both retries use the new token
    const retryA = httpMock.expectOne(urlA);
    const retryB = httpMock.expectOne(urlB);
    expect(retryA.request.headers.get('Authorization')).toBe('Bearer new-token');
    expect(retryB.request.headers.get('Authorization')).toBe('Bearer new-token');

    retryA.flush({ v: 'a' });
    retryB.flush({ v: 'b' });

    expect(bodyA).toEqual({ v: 'a' });
    expect(bodyB).toEqual({ v: 'b' });
  });
});
