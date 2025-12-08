// src/app/views/attendance/attendance.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AttendanceService, AttendanceRecord } from '../../core/services/attendance/attendance.service';

import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ButtonDirective,
  BadgeComponent,
  AlertComponent,
  TableDirective
} from '@coreui/angular';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
    BadgeComponent,
    AlertComponent,
    TableDirective
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  records: AttendanceRecord[] = [];
  loading = true;
  error = '';
  todayStatus = 'not-clocked-in';
  todayRecord: AttendanceRecord | null = null;
  clockedIn = false;

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadRecords();
    this.checkTodayStatus();
  }

  loadRecords() {
    this.loading = true;
    this.error = '';

    this.attendanceService.getAllRecords().subscribe({
      next: (response) => {
        if (response.success && response.records) {
          this.records = response.records;
          this.updateTodayRecord();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load attendance records', err);
        this.error = 'Failed to load attendance records. Please try again.';
        this.loading = false;
      }
    });
  }

  checkTodayStatus() {
    this.attendanceService.getTodayStatus().subscribe({
      next: (response) => {
        if (response.success) {
          this.todayStatus = response.status || 'not-clocked-in';
          this.clockedIn = response.status === 'clocked-in';
          
          if (response.record) {
            this.todayRecord = response.record;
          }
        }
      },
      error: (err) => {
        console.error('Failed to check today status', err);
      }
    });
  }

  updateTodayRecord() {
    const today = new Date().toISOString().split('T')[0];
    this.todayRecord = this.records.find(r => r.date === today) || null;
    
    if (this.todayRecord) {
      this.clockedIn = this.todayRecord.status === 'clocked-in';
    }
  }

  clockIn() {
    this.attendanceService.clockIn().subscribe({
      next: (response) => {
        if (response.success) {
          alert('Clocked in successfully!');
          this.loadRecords();
          this.checkTodayStatus();
        }
      },
      error: (err) => {
        console.error('Failed to clock in', err);
        this.error = err.error?.message || 'Failed to clock in. Please try again.';
      }
    });
  }

  clockOut() {
    this.attendanceService.clockOut().subscribe({
      next: (response) => {
        if (response.success) {
          alert('Clocked out successfully!');
          this.loadRecords();
          this.checkTodayStatus();
        }
      },
      error: (err) => {
        console.error('Failed to clock out', err);
        this.error = err.error?.message || 'Failed to clock out. Please try again.';
      }
    });
  }
}