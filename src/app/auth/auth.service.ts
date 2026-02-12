import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/data.models';
import { catchError, Observable, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private refreshTokenKey = 'refreshToken';
  private apiUrl = environment.apiUrl + 'user/'

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }
  signup(phoneNumber: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + "register/", { 'phoneNumber': phoneNumber, 'password': password });
  }

  requestOTP() {
    console.log('request for otp')
    return this.http.get<any>(this.apiUrl + 'otp/send/')
  }

  verifyOTP(otp: number) {
    return this.http.post<any>(this.apiUrl + 'otp/verify/', { otp })
  }

  login(phoneNumber: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'token/', { 'phone_number': phoneNumber, password })
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setRefreshToken(token: string): void {
    this.cookieService.set(this.refreshTokenKey, token, 1);
  }

  getRefreshToken(): string | null {
    return this.cookieService.get(this.refreshTokenKey)
  }

  logout(): void {
    this.removeToken();
    this.removeRefreshToken();
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  removeRefreshToken(): void {
    this.cookieService.delete(this.refreshTokenKey);
  }


  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      return true;
    } else {
      this.logout();
      return false;
    }
  }

  isTokenExpired(token: string): boolean {
    const decoded: any = jwtDecode(token);
    const expiryTime = decoded.exp * 1000;
    return Date.now() >= expiryTime;
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<any>(this.apiUrl + 'token/refresh/', { refresh: refreshToken }, { withCredentials: true }).pipe(
      tap(response => {
        console.log('refresh token sent to update the access token')
        this.setToken(response.access);
        this.setRefreshToken(response.refresh)
      }),
      catchError(error => {
        this.logout();
        return of({ 'error': error })
      })
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(this.apiUrl + 'profile/')
  }

  updateProfile(user: User): Observable<any> {
    return this.http.patch<any>(this.apiUrl + 'profile/', user)
  }

  updatePreferences(preferences: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'preferences/', preferences)
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'password/change/', { old_password: oldPassword, new_password: newPassword })
  }
}
