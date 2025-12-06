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
  template: `
    <div class="row">
      <div class="col-12">
        <!-- Stats Cards -->
        <div class="row mb-4">
          <div class="col-md-3">
            <c-card class="text-center">
              <c-card-body>
                <h3 class="mb-0">{{ stats.total }}</h3>
                <p class="text-muted mb-0">Total Tasks</p>
              </c-card-body>
            </c-card>
          </div>
          <div class="col-md-3">
            <c-card class="text-center border-warning">
              <c-card-body>
                <h3 class="mb-0 text-warning">{{ stats.pending }}</h3>
                <p class="text-muted mb-0">Pending</p>
              </c-card-body>
            </c-card>
          </div>
          <div class="col-md-3">
            <c-card class="text-center border-info">
              <c-card-body>
                <h3 class="mb-0 text-info">{{ stats.inProgress }}</h3>
                <p class="text-muted mb-0">In Progress</p>
              </c-card-body>
            </c-card>
          </div>
          <div class="col-md-3">
            <c-card class="text-center border-success">
              <c-card-body>
                <h3 class="mb-0 text-success">{{ stats.completed }}</h3>
                <p class="text-muted mb-0">Completed</p>
              </c-card-body>
            </c-card>
          </div>
        </div>

        <!-- Tasks Card -->
        <c-card>
          <c-card-header class="d-flex justify-content-between align-items-center">
            <h4 class="mb-0">My Tasks</h4>
            <div>
              <!-- Filter Dropdown -->
              <c-dropdown variant="btn-group">
                <button cButton color="light" size="sm" cDropdownToggle>
                  Filter: {{ currentFilter | titlecase }}
                </button>
                <ul cDropdownMenu>
                  <li><a cDropdownItem (click)="filterTasks('all')">All Tasks</a></li>
                  <li><a cDropdownItem (click)="filterTasks('pending')">Pending</a></li>
                  <li><a cDropdownItem (click)="filterTasks('in-progress')">In Progress</a></li>
                  <li><a cDropdownItem (click)="filterTasks('completed')">Completed</a></li>
                </ul>
              </c-dropdown>
            </div>
          </c-card-header>
          <c-card-body>
            <!-- Loading State -->
            <div *ngIf="loading" class="text-center py-5">
              <span class="spinner-border spinner-border-lg text-primary"></span>
              <p class="mt-2">Loading tasks...</p>
            </div>

            <!-- Error State -->
            <c-alert color="danger" *ngIf="error && !loading" [dismissible]="true">
              {{ error }}
            </c-alert>

            <!-- Empty State -->
            <div *ngIf="!loading && !error && tasks.length === 0" class="text-center py-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="text-muted mb-3" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
              </svg>
              <h5>No tasks found</h5>
              <p class="text-muted">You don't have any {{ currentFilter === 'all' ? '' : currentFilter }} tasks yet.</p>
            </div>

            <!-- Tasks Table -->
            <div class="table-responsive" *ngIf="!loading && !error && tasks.length > 0">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Assigned By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let task of tasks">
                    <td>
                      <strong>{{ task.title }}</strong>
                      <br>
                      <small class="text-muted">{{ task.description || 'No description' }}</small>
                    </td>
                    <td>
                      <span class="badge" 
                            [class.bg-danger]="task.priority === 'high'"
                            [class.bg-warning]="task.priority === 'medium'"
                            [class.bg-info]="task.priority === 'low'">
                        {{ task.priority | titlecase }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" 
                            [class.bg-success]="task.status === 'completed'"
                            [class.bg-info]="task.status === 'in-progress'"
                            [class.bg-warning]="task.status === 'pending'">
                        {{ task.status | titlecase }}
                      </span>
                    </td>
                    <td>
                      <span *ngIf="task.dueDate">
                        {{ task.dueDate | date:'MMM d, y' }}
                      </span>
                      <span *ngIf="!task.dueDate" class="text-muted">No due date</span>
                    </td>
                    <td>{{ task.assignedByName || 'Unknown' }}</td>
                    <td>
                      <div class="btn-group" role="group">
                        <button cButton color="primary" size="sm" (click)="viewTask(task)">
                          View
                        </button>
                        <button cButton color="success" size="sm" 
                                (click)="updateTaskStatus(task, 'in-progress')"
                                *ngIf="task.status === 'pending'">
                          Start
                        </button>
                        <button cButton color="success" size="sm" 
                                (click)="updateTaskStatus(task, 'completed')"
                                *ngIf="task.status === 'in-progress'">
                          Complete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </c-card-body>
        </c-card>
      </div>
    </div>
  `,
  styles: [`
    .table td {
      vertical-align: middle;
    }
    .badge {
      font-size: 0.75rem;
      padding: 0.35em 0.65em;
    }
  `]
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
    this.loadTasks();
    this.loadStats();
  }

  loadTasks() {
    this.loading = true;
    this.error = '';
    
    const filters = this.currentFilter !== 'all' ? { status: this.currentFilter } : undefined;
    
    this.taskService.getTasks(filters).subscribe({
      next: (response) => {
        if (response.success && response.tasks) {
          this.tasks = response.tasks;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.error = 'Failed to load tasks. Please try again.';
        this.loading = false;
      }
    });
  }

  loadStats() {
    this.taskService.getTaskStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.stats;
        }
      },
      error: (err) => {
        console.error('Failed to load stats', err);
      }
    });
  }

  filterTasks(status: string) {
    this.currentFilter = status;
    this.loadTasks();
  }

  viewTask(task: Task) {
    // TODO: Open modal or navigate to task detail
    alert(`Task: ${task.title}\n\nDescription: ${task.description || 'No description'}\n\nStatus: ${task.status}`);
  }

  updateTaskStatus(task: Task, newStatus: 'in-progress' | 'completed') {
    this.taskService.updateTask(task._id, { status: newStatus }).subscribe({
      next: (response) => {
        if (response.success) {
          // Reload tasks and stats
          this.loadTasks();
          this.loadStats();
          
          // Show success message
          const message = newStatus === 'completed' ? 'Task completed!' : 'Task started!';
          alert(message);
        }
      },
      error: (err) => {
        console.error('Failed to update task', err);
        this.error = 'Failed to update task. Please try again.';
      }
    });
  }
}