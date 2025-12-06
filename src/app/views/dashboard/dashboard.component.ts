// src/app/views/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth/auth.service';
import { environment } from '../../../environments/environment';
import { CardModule, GridModule, ProgressModule } from '@coreui/angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, GridModule, ProgressModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  user: any = null;
  stats = {
    tasksToday: 0,
    completedTasks: 0,
    attendanceThisMonth: 0,
    pendingTasks: 0
  };

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
    this.loadStats();
  }

  loadStats() {
    this.http.get<any>(`${environment.apiUrl}/api/dashboard/stats`).subscribe({
      next: (data) => this.stats = data,
      error: () => {} // silent fail
    });
  }
}