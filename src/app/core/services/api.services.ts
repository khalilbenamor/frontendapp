// src/app/core/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl; // "http://localhost:3000"

  constructor(private http: HttpClient) {}

  // Auth
  login(credentials: any) {
    return this.http.post(`${this.baseUrl}/api/auth/login`, credentials);
  }

  // Attendance
  getAttendanceRecords() {
    return this.http.get(`${this.baseUrl}/api/attendance/records`);
  }

  clockIn() {
    return this.http.post(`${this.baseUrl}/api/attendance/clock-in`, {});
  }

  // Tasks
  getTasks() {
    return this.http.get(`${this.baseUrl}/api/tasks`);
  }

  createTask(task: any) {
    return this.http.post(`${this.baseUrl}/api/tasks`, task);
  }
}