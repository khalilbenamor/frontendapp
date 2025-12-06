import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
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
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'Manager' | 'Employee';
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
        this.currentUserSubject.next(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading user from storage:', error);
        this.clearAuth();
      }
    }
  }

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/auth/register`, data).pipe(
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, {
      email,
      password
    }).pipe(
      tap(res => {
        console.log('Login response:', res); // Debug log
        if (res.success && res.token && res.user) {
          console.log('User role:', res.user.role); // Debug log
          localStorage.setItem('token', res.token);
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
          
          // Add a small delay before navigation to ensure state is updated
          setTimeout(() => {
            if (res.user.role === 'Employee') {
              console.log('Navigating to /tasks'); // Debug log
              this.router.navigate(['/tasks']);
            } else if (res.user.role === 'Manager') {
              console.log('Navigating to /dashboard'); // Debug log
              this.router.navigate(['/dashboard']);
            }
          }, 100);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    this.clearAuth();
    this.router.navigate(['/login']);
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
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): 'Manager' | 'Employee' | null {
    return this.currentUserSubject.value?.role || null;
  }

  isManager(): boolean {
    return this.currentUserSubject.value?.role === 'Manager';
  }

  isEmployee(): boolean {
    return this.currentUserSubject.value?.role === 'Employee';
  }
}