// src/app/views/auth/register/register.component.ts

import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ButtonDirective,
  FormDirective,
  FormControlDirective,
  FormLabelDirective,
  FormFeedbackComponent
} from '@coreui/angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
    FormDirective,
    FormControlDirective,
    FormLabelDirective,
    FormFeedbackComponent
  ],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <c-card class="shadow-sm">
            <c-card-header class="text-center bg-primary text-white py-4">
              <h3 class="mb-0">Create Account</h3>
            </c-card-header>
            <c-card-body class="p-4">
              <form cForm [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label cLabel for="name">Full Name</label>
                  <input cFormControl id="name" formControlName="name"
                    [class.is-invalid]="submitted && f['name'].errors" />
                  <c-form-feedback *ngIf="submitted && f['name'].errors" invalid>
                    Name is required
                  </c-form-feedback>
                </div>

                <div class="mb-3">
                  <label cLabel for="email">Email Address</label>
                  <input cFormControl id="email" type="email" formControlName="email"
                    placeholder="you@company.com"
                    [class.is-invalid]="submitted && f['email'].errors" />
                  <c-form-feedback *ngIf="submitted && f['email'].errors" invalid>
                    <span *ngIf="f['email'].errors?.['required']">Email is required</span>
                    <span *ngIf="f['email'].errors?.['email']">Invalid email format</span>
                  </c-form-feedback>
                </div>

                <div class="mb-3">
                  <label cLabel for="password">Password</label>
                  <input cFormControl id="password" type="password" formControlName="password"
                    [class.is-invalid]="submitted && f['password'].errors" />
                  <c-form-feedback *ngIf="submitted && f['password'].errors" invalid>
                    <span *ngIf="f['password'].errors?.['required']">Password is required</span>
                    <span *ngIf="f['password'].errors?.['minlength']">Min 6 characters</span>
                  </c-form-feedback>
                </div>

                <div class="mb-4">
                  <label cLabel for="role">Role</label>
                  <select cFormControl id="role" formControlName="role">
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>

                <button cButton color="primary" class="w-100" type="submit" [disabled]="loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Create Account
                </button>

                <div class="text-center mt-3">
                  <small class="text-muted">
                    Already have an account?
                    <a routerLink="/login" class="text-primary">Sign in</a>
                  </small>
                </div>
              </form>
            </c-card-body>
          </c-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    c-card { border: none; border-radius: 1rem; overflow: hidden; }
    c-card-header { border-radius: 1rem 1rem 0 0 !important; }
  `]
})
export class RegisterComponent {
  registerForm: ReturnType<FormBuilder['group']>;
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Employee', Validators.required]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    this.loading = true;

    this.http.post(`${environment.apiUrl}/api/auth/register`, this.registerForm.value)
      .subscribe({
        next: () => {
          alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert(err.error?.message || 'Registration failed');
          this.loading = false;
        }
      });
  }
}