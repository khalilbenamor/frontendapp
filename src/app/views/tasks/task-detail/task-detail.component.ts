import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Task {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    assignee: string;
}

@Component({
    selector: 'app-task-detail',
    templateUrl: './task-detail.component.html',
    styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
    task: Task | null = null;
    loading = true;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadTask();
    }

    loadTask(): void {
        const taskId = this.route.snapshot.paramMap.get('id');
        if (taskId) {
            // TODO: Replace with actual service call
            // this.taskService.getTask(+taskId).subscribe(
            //   (task) => {
            //     this.task = task;
            //     this.loading = false;
            //   },
            //   (error) => {
            //     this.error = 'Failed to load task';
            //     this.loading = false;
            //   }
            // );
            this.loading = false;
        }
    }

    goBack(): void {
        this.router.navigate(['/tasks']);
    }

    updateTask(): void {
        // TODO: Implement update logic
    }

    deleteTask(): void {
        // TODO: Implement delete logic
    }
}