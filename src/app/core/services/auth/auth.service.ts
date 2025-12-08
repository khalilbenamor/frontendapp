import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Manager' | 'Employee';
  rfidTag?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'Manager' | 'Employee';
  rfidTag?: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyTokenResponse {
  success: boolean;
  message: string;
  email?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        console.log('👤 User loaded from storage:', user);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('❌ Error loading user from storage:', error);
        this.clearAuth();
      }
    }
  }

  register(data: RegisterData): Observable<LoginResponse> {
    console.log('📝 Auth Service - Register request:', data);
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/auth/register`, data).pipe(
      tap(res => {
        console.log('✅ Auth Service - Register response:', res);
        if (res.success && res.token && res.user) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      }),
      catchError(error => {
        console.error('❌ Auth Service - Register error:', error);
        return throwError(() => error);
      })
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    console.log('🔐 Auth Service - Login request:', email);
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, { email, password }).pipe(
      tap(res => {
        console.log('✅ Auth Service - Login response:', res);
        if (res.success && res.token && res.user) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      }),
      catchError(error => {
        console.error('❌ Auth Service - Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout:
   * - optionally call server /api/auth/logout to blacklist the token (best-effort)
   * - ALWAYS clear local client state (token, currentUser) and navigate to /login
   */
  logout() {
    const token = this.getToken();

    if (!token) {
      // No token: just clean client
      this.clearAuth();
      this.router.navigate(['/login']);
      return;
    }

    // Best-effort server logout; your auth interceptor should attach Authorization header.
    this.http.post<{ success: boolean; message?: string }>(`${environment.apiUrl}/api/auth/logout`, {}).pipe(
      catchError(err => {
        console.warn('AuthService.logout: server logout failed (continuing client cleanup)', err);
        // swallow error and continue
        return of(null);
      }),
      finalize(() => {
        // Always cleanup client-side state
        this.clearAuth();
        this.router.navigate(['/login']);
      })
    ).subscribe();
  }

  /**
   * Request password reset link
   * Sends an email with reset token to the user
   */
  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    console.log('🔐 Auth Service - Forgot password request:', email);
    return this.http.post<ForgotPasswordResponse>(
      `${environment.apiUrl}/api/auth/forgot-password`,
      { email }
    ).pipe(
      tap(res => {
        console.log('✅ Auth Service - Forgot password response:', res);
      }),
      catchError(error => {
        console.error('❌ Auth Service - Forgot password error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Verify if a reset token is valid
   * Call this when user clicks the reset link in their email
   */
  verifyResetToken(token: string): Observable<VerifyTokenResponse> {
    console.log('🔐 Auth Service - Verify reset token');
    return this.http.get<VerifyTokenResponse>(
      `${environment.apiUrl}/api/auth/verify-reset-token/${token}`
    ).pipe(
      tap(res => {
        console.log('✅ Auth Service - Token verified:', res);
      }),
      catchError(error => {
        console.error('❌ Auth Service - Verify token error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Reset password with valid token
   * Called when user submits new password on reset form
   */
  resetPassword(token: string, newPassword: string): Observable<ResetPasswordResponse> {
    console.log('🔄 Auth Service - Reset password request');
    return this.http.post<ResetPasswordResponse>(
      `${environment.apiUrl}/api/auth/reset-password`,
      { token, newPassword }
    ).pipe(
      tap(res => {
        console.log('✅ Auth Service - Password reset successful:', res);
      }),
      catchError(error => {
        console.error('❌ Auth Service - Reset password error:', error);
        return throwError(() => error);
      })
    );
  }

  private clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const isLoggedIn = !!token;
    console.log('🔍 Is logged in?', isLoggedIn, 'Token:', token ? 'exists' : 'missing');
    return isLoggedIn;
  }

  getCurrentUser(): User | null {
    const user = this.currentUserSubject.value;
    console.log('👤 Get current user:', user);
    return user;
  }

  getUserRole(): 'Manager' | 'Employee' | null {
    const role = this.currentUserSubject.value?.role || null;
    console.log('🎭 Get user role:', role);
    return role;
  }

  isManager(): boolean {
    return this.currentUserSubject.value?.role === 'Manager';
  }

  isEmployee(): boolean {
    return this.currentUserSubject.value?.role === 'Employee';
  }
}