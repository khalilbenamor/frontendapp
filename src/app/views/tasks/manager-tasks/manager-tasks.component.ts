// src/app/views/tasks/manager-tasks/manager-tasks.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
    RouterLink,
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
  templateUrl: './manager-tasks.component.html',
  styleUrls: ['./manager-tasks.component.scss']
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
    this.http.get<any>(`${environment.apiUrl}/api/auth/users`).subscribe({
      next: (response) => {
        if (response.success && response.users) {
          // Filter only employees
          this.employees = response.users.filter((u: User) => u.role === 'Employee');
        }
      },
      error: (err) => {
        console.error('Failed to load employees', err);
        this.modalError = 'Failed to load employees list.';
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