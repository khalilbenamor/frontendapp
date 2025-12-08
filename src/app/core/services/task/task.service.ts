// src/app/core/services/task/task.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
export interface Task {
  _id: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedToName?: string;
  assignedBy: string;
  assignedByName?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskResponse {
  success: boolean;
  tasks?: Task[];
  task?: Task;
  message?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  assignedTo: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly baseUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(filters?: { status?: string; priority?: string }): Observable<TaskResponse> {
    let url = this.baseUrl;
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.http.get<TaskResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  getTaskById(id: string): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createTask(data: CreateTaskData): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(this.baseUrl, data).pipe(
      catchError(this.handleError)
    );
  }

  updateTask(id: string, data: UpdateTaskData): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.baseUrl}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteTask(id: string): Observable<TaskResponse> {
    return this.http.delete<TaskResponse>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getTaskStats(): Observable<{ success: boolean; stats: TaskStats }> {
    return this.http.get<{ success: boolean; stats: TaskStats }>(`${this.baseUrl}/stats/summary`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Task service error:', error);
    return throwError(() => error);
  }
}