import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { SubscriptionPlan, User } from '../models/data.models';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private accessToken: string | null = null;

  private tokenKey = 'authToken';
  private refreshTokenKey = 'refreshToken';
  private apiUrl = environment.apiUrl + 'user/'

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }
  signup(phoneNumber: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + "register/", { 'phoneNumber': phoneNumber, 'password': password }, { withCredentials: true });
  }

  requestOTP(phoneNumber: string): Observable<any> {
    console.log('request for otp')
    return this.http.post<any>(this.apiUrl + 'otp/send/', { phone_number: phoneNumber })
  }

  verifyOTP(phoneNumber: string, otp: string) {
    return this.http.post<any>(this.apiUrl + 'otp/verify/', { phone_number: phoneNumber, otp: otp }, { withCredentials: true })
  }

  login(phoneNumber: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'token/', { 'phone_number': phoneNumber, password }, { withCredentials: true })
  }

  setToken(token: string): void {
    this.accessToken = token;
  }

  getToken(): string | null {
    return this.accessToken;
  }


  logout(): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'logout/', {}, { withCredentials: true })

  }

  removeToken(): void {
    this.accessToken = null
  }

  refreshAccessToken(): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'token/refresh/', {}, { withCredentials: true }).pipe(
      tap(response => {
        console.log('refresh token sent to update the access token')
        this.setToken(response.access);
      }),
      catchError(error => {
        return throwError(() => error)
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

  requestPasswordOTP(): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'user/request-password-otp/', {});
  }
  setPasswordWithOTP(otp: string, newPassword: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'user/set-password/', {
      otp: otp,
      new_password: newPassword
    });
  }
}
