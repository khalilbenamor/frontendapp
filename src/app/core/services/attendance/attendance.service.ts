// src/app/core/services/attendance/attendance.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AttendanceRecord {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  clockIn: string;
  clockOut?: string;
  duration?: number;
  status: 'clocked-in' | 'clocked-out';
  date: string;
}

export interface AttendanceResponse {
  success: boolean;
  records?: AttendanceRecord[];
  record?: AttendanceRecord;
  attendance?: AttendanceRecord;
  status?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private readonly baseUrl = `${environment.apiUrl}/api/attendance`;

  constructor(private http: HttpClient) {}

  clockIn(): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(`${this.baseUrl}/clock-in`, {}).pipe(
      catchError(this.handleError)
    );
  }

  clockOut(): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(`${this.baseUrl}/clock-out`, {}).pipe(
      catchError(this.handleError)
    );
  }

  getMyRecords(): Observable<AttendanceResponse> {
    return this.http.get<AttendanceResponse>(`${this.baseUrl}/my-records`).pipe(
      catchError(this.handleError)
    );
  }

  getAllRecords(filters?: { startDate?: string; endDate?: string; userId?: string }): Observable<AttendanceResponse> {
    let url = `${this.baseUrl}/records`;
    const params = new URLSearchParams();
    
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.userId) params.append('userId', filters.userId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.http.get<AttendanceResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  getTodayStatus(): Observable<AttendanceResponse> {
    return this.http.get<AttendanceResponse>(`${this.baseUrl}/today-status`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Attendance service error:', error);
    return throwError(() => error);
  }
}