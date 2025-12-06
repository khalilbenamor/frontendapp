// src/app/views/auth/login/login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RouterLink } from '@angular/router';

import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardComponent,
  CardBodyComponent,
  CardGroupComponent,
  ButtonDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective
} from '@coreui/angular';

import { cilUser, cilLockLocked, cilWarning } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    CardComponent,
    CardBodyComponent,
    ButtonDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  icons = { cilUser, cilLockLocked, cilWarning };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.error = '';

    if (!this.email && !this.password) {
      this.error = 'Please enter your email and password.';
      return;
    }
    if (!this.email) {
      this.error = 'Please enter your email address.';
      return;
    }
    if (!this.password) {
      this.error = 'Please enter your password.';
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response.user.role);
        
        // Role-based redirect
        if (response.user.role === 'Manager') {
          // Manager goes to attendance page
          this.router.navigate(['/attendance']);
        } else {
          // Employee goes to tasks page
          this.router.navigate(['/tasks']);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = 'Invalid email or password.';
        this.loading = false;
      }
    });
  }
}