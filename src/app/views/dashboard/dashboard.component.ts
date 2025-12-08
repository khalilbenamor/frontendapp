import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth/auth.service';
import { TaskService, CreateTaskData, Task } from '../../core/services/task/task.service';
import { CardModule, GridModule, ProgressModule, ButtonDirective, TableDirective } from '@coreui/angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, GridModule, ProgressModule, ButtonDirective, TableDirective],
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

  // Manager-specific
  managerTasks: Task[] = [];
  creating = false;
  loadingTasks = false;
  createError = '';
  createSuccess = '';

  createForm;

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private taskService: TaskService,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assignedTo: ['', Validators.required],
      priority: ['medium'],
      dueDate: ['']
    });
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadStats();

    if (this.authService.isManager()) {
      this.loadAllTasks();
    }
  }

  loadStats() {
    this.http.get<any>(`${(window as any).__env?.apiUrl ?? ''}/api/dashboard/stats`).subscribe({
      next: (data) => this.stats = data,
      error: () => {} // silent fail
    });
  }

  // ----- Manager functions -----
  loadAllTasks() {
    this.loadingTasks = true;
    this.taskService.getTasks().subscribe({
      next: (res) => {
        if (res && res.success && res.tasks) {
          this.managerTasks = res.tasks;
        } else {
          this.managerTasks = [];
        }
        this.loadingTasks = false;
      },
      error: (err) => {
        console.error('Failed to load manager tasks', err);
        this.managerTasks = [];
        this.loadingTasks = false;
      }
    });
  }

  createTask() {
    this.createError = '';
    this.createSuccess = '';
    if (this.createForm.invalid) {
      this.createError = 'Please fill required fields (title and assigned user id).';
      return;
    }

    this.creating = true;
    const raw = this.createForm.value;
    
    // Type-safe extraction with proper null/undefined handling
    const title = raw.title?.trim();
    const assignedTo = raw.assignedTo?.trim();
    const priority = raw.priority as 'low' | 'medium' | 'high' | undefined;
    
    if (!title || !assignedTo) {
      this.creating = false;
      this.createError = 'Title and assigned user are required.';
      return;
    }

    const payload: CreateTaskData = {
      title,
      description: raw.description?.trim() || undefined,
      assignedTo,
      priority: priority || 'medium',
      dueDate: raw.dueDate ? new Date(raw.dueDate).toISOString() : undefined
    };

    this.taskService.createTask(payload).subscribe({
      next: (res) => {
        this.creating = false;
        if (res && res.success && res.task) {
          this.createSuccess = 'Task created successfully';
          // prepend to list
          this.managerTasks.unshift(res.task);
          this.createForm.reset({ priority: 'medium' });
        } else {
          this.createError = res?.message || 'Failed to create task';
        }
      },
      error: (err) => {
        console.error('Create task error', err);
        this.creating = false;
        this.createError = err?.error?.message || 'Server error while creating task';
      }
    });
  }

  updateTaskStatus(task: Task, newStatus: 'in-progress' | 'completed' | 'pending') {
    this.taskService.updateTask(task._id, { status: newStatus }).subscribe({
      next: (res) => {
        if (res && res.success && res.task) {
          // update local copy
          const idx = this.managerTasks.findIndex(t => t._id === task._id);
          if (idx !== -1) this.managerTasks[idx] = res.task;
        } else {
          console.warn('Update task returned unexpected response', res);
        }
      },
      error: (err) => {
        console.error('Failed to update task', err);
      }
    });
  }

  // Optional: delete a task (manager)
  deleteTask(taskId: string) {
    if (!confirm('Delete this task?')) return;
    this.taskService.deleteTask(taskId).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.managerTasks = this.managerTasks.filter(t => t._id !== taskId);
        } else {
          alert(res?.message || 'Failed to delete task');
        }
      },
      error: (err) => {
        console.error('Delete task error', err);
        alert('Server error while deleting task');
      }
    });
  }

  // Logout helper (already implemented in AuthService)
  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}