// src/app/views/tasks/task-list/task-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.services';
import { CardModule } from '@coreui/angular';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.apiService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data as any[];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.loading = false;
      }
    });
  }
}