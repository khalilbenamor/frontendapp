// src/app/views/attendance/attendance.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// CoreUI v5 components & directives
import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ButtonDirective,
  TableDirective,
  BadgeComponent,          // ← this is the correct badge in v5
  GridModule
} from '@coreui/angular';

interface AttendanceRecord {
  id: string;
  clockIn: string;
  clockOut?: string;
  date: string;
  duration?: string;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
    TableDirective,
    BadgeComponent        // ← correct badge component
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  records: AttendanceRecord[] = [];
  todayRecord: AttendanceRecord | null = null;
  loading = false;
  clockedIn = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTodayStatus();
    this.loadHistory();
   
  }

  loadTodayStatus() {
    this.http.get<any>(`${environment.apiUrl}/api/attendance/today`).subscribe({
      next: (res) => {
        this.todayRecord = res.record || null;
        this.clockedIn = !!res.record && !res.record.clockOut;
      },
      error: () => {}
    });
  }

  loadHistory() {
    this.http.get<AttendanceRecord[]>(`${environment.apiUrl}/api/attendance/history`).subscribe({
      next: (data) => this.records = data,
      error: () => this.records = []
    });
  }

  clockIn() {
    this.loading = true;
    this.http.post(`${environment.apiUrl}/api/attendance/clock-in`, {}).subscribe({
      next: () => {
        this.clockedIn = true;
        this.loadTodayStatus();
        this.loadHistory();
        this.loading = false;
      }
    });
  }

  clockOut() {
    this.loading = true;
    this.http.post(`${environment.apiUrl}/api/attendance/clock-out`, {}).subscribe({
      next: () => {
        this.clockedIn = false;
        this.loadTodayStatus();
        this.loadHistory();
        this.loading = false;
      }
    });
  }
}