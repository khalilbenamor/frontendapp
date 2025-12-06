// src/app/views/tasks/manager-tasks/manager-tasks.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task, CreateTaskData } from '../../../core/services/task/task.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ButtonDirective,
  BadgeComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  FormDirective,
  FormLabelDirective,
  FormControlDirective,
  FormSelectDirective,
  AlertComponent
} from '@coreui/angular';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-manager-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
    BadgeComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    FormSelectDirective,
    AlertComponent
  ],
  template: `
    <div class="row">
      <div class="col-12">
        <!-- Create Task Button -->
        <div class="mb-3">
          <button cButton color="primary" (click)="openCreateModal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            Create New Task
          </button>
        </div>

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

        <!-- Tasks Table -->
        <c-card>
          <c-card-header>
            <h4 class="mb-0">All Tasks</h4>
          </c-card-header>
          <c-card-body>
            <div *ngIf="loading" class="text-center py-5">
              <span class="spinner-border text-primary"></span>
              <p class="mt-2">Loading tasks...</p>
            </div>

            <c-alert color="danger" *ngIf="error" [dismissible]="true">
              {{ error }}
            </c-alert>

            <div class="table-responsive" *ngIf="!loading && tasks.length > 0">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assigned To</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
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
                    <td>{{ task.assignedToName || 'Unknown' }}</td>
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
                      {{ task.dueDate ? (task.dueDate | date:'MMM d, y') : 'No due date' }}
                    </td>
                    <td>
                      <button cButton color="danger" size="sm" (click)="deleteTask(task)">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div *ngIf="!loading && tasks.length === 0" class="text-center py-5">
              <p class="text-muted">No tasks created yet.</p>
            </div>
          </c-card-body>
        </c-card>
      </div>
    </div>

    <!-- Create Task Modal -->
    <c-modal [visible]="showCreateModal" (visibleChange)="showCreateModal = $event">
      <c-modal-header>
        <h5>Create New Task</h5>
      </c-modal-header>
      <c-modal-body>
        <c-alert color="danger" *ngIf="modalError" [dismissible]="true">
          {{ modalError }}
        </c-alert>

        <form cForm>
          <div class="mb-3">
            <label cLabel for="title">Title *</label>
            <input cFormControl id="title" [(ngModel)]="newTask.title" 
                   name="title" placeholder="Enter task title" />
          </div>

          <div class="mb-3">
            <label cLabel for="description">Description</label>
            <textarea cFormControl id="description" [(ngModel)]="newTask.description" 
                      name="description" rows="3" 
                      placeholder="Enter task description"></textarea>
          </div>

          <div class="mb-3">
            <label cLabel for="assignedTo">Assign To *</label>
            <select cFormControl id="assignedTo" [(ngModel)]="newTask.assignedTo" name="assignedTo">
              <option value="">Select employee...</option>
              <option *ngFor="let user of employees" [value]="user._id">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label cLabel for="priority">Priority</label>
            <select cFormControl id="priority" [(ngModel)]="newTask.priority" name="priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="mb-3">
            <label cLabel for="dueDate">Due Date</label>
            <input cFormControl type="date" id="dueDate" 
                   [(ngModel)]="newTask.dueDate" name="dueDate" />
          </div>
        </form>
      </c-modal-body>
      <c-modal-footer>
        <button cButton color="secondary" (click)="showCreateModal = false" [disabled]="submitting">
          Cancel
        </button>
        <button cButton color="primary" (click)="createTask()" [disabled]="submitting">
          <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
          {{ submitting ? 'Creating...' : 'Create Task' }}
        </button>
      </c-modal-footer>
    </c-modal>
  `,
  styles: [`
    .badge {
      font-size: 0.75rem;
      padding: 0.35em 0.65em;
    }
  `]
})
export class ManagerTasksComponent implements OnInit {
  tasks: Task[] = [];
  employees: User[] = [];
  loading = true;
  error = '';
  showCreateModal = false;
  submitting = false;
  modalError = '';

  stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  };

  newTask: CreateTaskData = {
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: ''
  };

  constructor(
    private taskService: TaskService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadStats();
    this.loadEmployees();
  }

  loadTasks() {
    this.loading = true;
    this.error = '';
    
    this.taskService.getTasks().subscribe({
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
      error: (err) => console.error('Failed to load stats', err)
    });
  }

  loadEmployees() {
    // Load all users to get employees list
    this.http.get<any>(`${environment.apiUrl}/api/auth/users`).subscribe({
      next: (response) => {
        // Filter only employees
        this.employees = response.users?.filter((u: User) => u.role === 'Employee') || [];
      },
      error: (err) => {
        console.error('Failed to load employees', err);
        // For now, we'll just log the error
      }
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
    this.modalError = '';
    this.newTask = {
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: ''
    };
  }

  createTask() {
    this.modalError = '';

    if (!this.newTask.title || !this.newTask.assignedTo) {
      this.modalError = 'Title and Assign To are required.';
      return;
    }

    this.submitting = true;

    this.taskService.createTask(this.newTask).subscribe({
      next: (response) => {
        if (response.success) {
          this.showCreateModal = false;
          this.loadTasks();
          this.loadStats();
          alert('Task created successfully!');
        }
        this.submitting = false;
      },
      error: (err) => {
        console.error('Failed to create task', err);
        this.modalError = err.error?.message || 'Failed to create task. Please try again.';
        this.submitting = false;
      }
    });
  }

  deleteTask(task: Task) {
    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return;
    }

    this.taskService.deleteTask(task._id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadTasks();
          this.loadStats();
          alert('Task deleted successfully!');
        }
      },
      error: (err) => {
        console.error('Failed to delete task', err);
        this.error = 'Failed to delete task. Please try again.';
      }
    });
  }
}