// src/app/views/tasks/task-list/task-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService, Task } from '../../../core/services/task/task.service';
import { AuthService } from '../../../core/services/auth/auth.service';

import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ButtonDirective,
  BadgeComponent,
  DropdownComponent,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  AlertComponent
} from '@coreui/angular';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
    BadgeComponent,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    AlertComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;
  error = '';
  currentFilter = 'all';
  
  stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  };

  constructor(
    private taskService: TaskService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('🔎 TaskListComponent ngOnInit — component instantiated');
    this.loadTasks();
    this.loadStats();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = '';
    console.log('🔁 loadTasks with filter:', this.currentFilter);

    const filters = this.currentFilter !== 'all' ? { status: this.currentFilter } : undefined;

    this.taskService.getTasks(filters).subscribe({
      next: (response) => {
        console.log('📥 getTasks response', response);
        if (response && response.success && response.tasks) {
          this.tasks = response.tasks;
        } else {
          // If API returns success:false or unexpected shape, show a message
          this.tasks = [];
          if (response && response.message) {
            this.error = response.message;
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load tasks', err);
        this.error = err?.error?.message || 'Failed to load tasks. Please try again.';
        this.tasks = [];
        this.loading = false;
      }
    });
  }

  loadStats(): void {
    console.log('🔁 loadStats');
    this.taskService.getTaskStats().subscribe({
      next: (response) => {
        console.log('📊 getTaskStats response', response);
        if (response && response.success && response.stats) {
          this.stats = response.stats;
        }
      },
      error: (err) => {
        console.error('❌ Failed to load stats', err);
      }
    });
  }

  filterTasks(status: string): void {
    console.log('🎚 filterTasks ->', status);
    this.currentFilter = status;
    this.loadTasks();
  }

  viewTask(task: Task): void {
    // TODO: Open modal or navigate to task detail
    alert(`Task: ${task.title}\n\nDescription: ${task.description || 'No description'}\n\nStatus: ${task.status}`);
  }

  updateTaskStatus(task: Task, newStatus: 'in-progress' | 'completed'): void {
    console.log(`✏️ updateTaskStatus ${task._id} -> ${newStatus}`);
    this.taskService.updateTask(task._id, { status: newStatus }).subscribe({
      next: (response) => {
        console.log('✅ updateTask response', response);
        if (response && response.success) {
          // Reload tasks and stats
          this.loadTasks();
          this.loadStats();

          const message = newStatus === 'completed' ? 'Task completed!' : 'Task started!';
          alert(message);
        } else {
          this.error = response?.message || 'Failed to update task';
        }
      },
      error: (err) => {
        console.error('❌ Failed to update task', err);
        this.error = err?.error?.message || 'Failed to update task. Please try again.';
      }
    });
  }

  logout(): void {
    // optional: confirm before logout
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}