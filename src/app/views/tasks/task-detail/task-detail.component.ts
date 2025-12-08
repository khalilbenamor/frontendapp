// src/app/views/tasks/task-detail/task-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService, Task } from '../../../core/services/task/task.service';

import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ButtonDirective,
  BadgeComponent,
  AlertComponent
} from '@coreui/angular';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
    BadgeComponent,
    AlertComponent
  ],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadTask();
  }

  loadTask(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    
    if (!taskId) {
      this.error = 'Task ID not provided';
      this.loading = false;
      return;
    }

    this.taskService.getTaskById(taskId).subscribe({
      next: (response) => {
        if (response.success && response.task) {
          this.task = response.task;
        } else {
          this.error = 'Task not found';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load task', err);
        this.error = 'Failed to load task details';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  updateStatus(newStatus: 'in-progress' | 'completed'): void {
    if (!this.task) return;

    this.taskService.updateTask(this.task._id, { status: newStatus }).subscribe({
      next: (response) => {
        if (response.success && response.task) {
          this.task = response.task;
          alert('Task updated successfully!');
        }
      },
      error: (err) => {
        console.error('Failed to update task', err);
        this.error = 'Failed to update task';
      }
    });
  }
}