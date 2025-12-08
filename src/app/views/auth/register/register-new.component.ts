// src/app/views/auth/register/register-new.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import {
  ContainerComponent, RowComponent, ColComponent, CardComponent,
  CardBodyComponent, FormDirective, InputGroupComponent,
  InputGroupTextDirective, FormControlDirective, ButtonDirective, AlertComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-register-new',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    ContainerComponent, RowComponent, ColComponent, CardComponent,
    CardBodyComponent, FormDirective, InputGroupComponent,
    InputGroupTextDirective, FormControlDirective, ButtonDirective,
    AlertComponent, IconDirective
  ],
  template: `
    <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
      <c-container>
        <c-row class="justify-content-center">
          <c-col md="8" lg="6">
            <c-card>
              <c-card-body class="p-4">
                <h1>Register</h1>
                <p class="text-medium-emphasis">Create your account</p>
                
                <c-alert color="danger" *ngIf="error" [dismissible]="true">
                  {{ error }}
                </c-alert>
                
                <c-alert color="success" *ngIf="success" [dismissible]="true">
                  {{ success }}
                </c-alert>

                <form cForm [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                  <!-- Name -->
                  <c-input-group class="mb-3">
                    <span cInputGroupText>
                      <svg cIcon name="cilUser"></svg>
                    </span>
                    <input cFormControl placeholder="Full Name" formControlName="name" />
                  </c-input-group>

                  <!-- Email -->
                  <c-input-group class="mb-3">
                    <span cInputGroupText>@</span>
                    <input cFormControl type="email" placeholder="Email" formControlName="email" />
                  </c-input-group>

                  <!-- Password -->
                  <c-input-group class="mb-3">
                    <span cInputGroupText>
                      <svg cIcon name="cilLockLocked"></svg>
                    </span>
                    <input cFormControl type="password" placeholder="Password" formControlName="password" />
                  </c-input-group>

                  

                  <!-- NFC Badge (Optional) -->
                  <div class="mb-3">
                    <hr>
                    <h6 class="mb-2">NFC Badge (Optional)</h6>
                    <c-input-group class="mb-2">
                      <span cInputGroupText>
                        <svg cIcon name="cilCreditCard"></svg>
                      </span>
                      <input cFormControl placeholder="Badge UID" formControlName="rfidTag" 
                             [readonly]="waitingForBadge" />
                      <button cButton color="primary" type="button" 
                              (click)="scanBadge()" [disabled]="waitingForBadge">
                        {{ waitingForBadge ? 'Scanning...' : 'Scan' }}
                      </button>
                    </c-input-group>
                    <small class="text-muted">You can add badge later</small>
                  </div>

                  <!-- Submit -->
                  <button cButton color="success" class="w-100" type="submit" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? 'Creating...' : 'Create Account' }}
                  </button>
                </form>

                <p class="text-center mt-3">
                  <a routerLink="/login">Already have an account? Sign in</a>
                </p>
              </c-card-body>
            </c-card>
          </c-col>
        </c-row>
      </c-container>
    </div>
  `
})
export class RegisterNewComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  error = '';
  success = '';
  waitingForBadge = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Employee', Validators.required],
      rfidTag: ['']
    });
  }

  scanBadge(): void {
    this.waitingForBadge = true;
    alert('Please scan your NFC badge or enter UID manually');
    this.waitingForBadge = false;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = '';

    const formData = this.registerForm.value;
    if (!formData.rfidTag) delete formData.rfidTag;

    console.log('📝 Registering:', formData.email, 'Role:', formData.role);

    this.authService.register(formData).subscribe({
      next: (res) => {
        console.log('✅ Registration successful:', res);
        
        if (res.token && res.user) {
          console.log('🔑 Auto-login enabled');
          localStorage.setItem('token', res.token);
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.authService['currentUserSubject'].next(res.user);
          
          this.success = 'Account created! Redirecting...';
          
          setTimeout(() => {
            if (res.user.role === 'Manager') {
              console.log('🎯 Redirecting to /dashboard');
              this.router.navigate(['/login']);
            } else {
              console.log('🎯 Redirecting to /tasks');
              this.router.navigate(['/login']);
            }
          }, 1000);
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Registration error:', err);
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}