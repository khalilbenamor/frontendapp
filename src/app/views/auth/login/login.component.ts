// src/app/views/auth/login/login.component.ts
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import {
  ContainerComponent, RowComponent, ColComponent, CardComponent,
  CardBodyComponent, CardGroupComponent, ButtonDirective, FormDirective,
  InputGroupComponent, InputGroupTextDirective, TabsModule
} from '@coreui/angular';
import { cilUser, cilLockLocked, cilWarning, cilCreditCard } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ContainerComponent, RowComponent, ColComponent,
    CardGroupComponent, CardComponent, CardBodyComponent, ButtonDirective,
    FormDirective, InputGroupComponent, InputGroupTextDirective,
    IconDirective, RouterLink, TabsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // Email/Password login
  email = '';
  password = '';
  
  // NFC login
  rfidTag = '';
  waitingForBadge = false;
  
  loading = false;
  error = '';
  
  loginMode: 'email' | 'nfc' = 'email';

  icons = { cilUser, cilLockLocked, cilWarning, cilCreditCard };

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  switchMode(mode: 'email' | 'nfc') {
    this.loginMode = mode;
    this.error = '';
  }

  onLogin() {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Please enter email and password';
      return;
    }

    this.loading = true;
    console.log('🔐 Attempting login...');

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('✅ Login successful:', response);
        this.loading = false;
        
        if (response.user?.role === 'Manager') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/tasks']);
        }
      },
      error: (err) => {
        console.error('❌ Login error:', err);
        this.error = 'Invalid email or password';
        this.loading = false;
      }
    });
  }

  scanBadge() {
    this.waitingForBadge = true;
    this.error = '';
    
    // Simulate badge scan - replace with actual ESP32 integration
    setTimeout(() => {
      this.waitingForBadge = false;
      alert('Please scan your NFC badge on ESP32 reader or enter UID manually');
    }, 100);
  }

  loginWithBadge() {
    if (!this.rfidTag) {
      this.error = 'Please enter or scan badge UID';
      return;
    }

    this.loading = true;
    this.error = '';
    
    console.log('🔐 NFC Login attempt:', this.rfidTag);

    // Get user by RFID
    this.http.get<any>(`${environment.apiUrl}/api/auth/user/${this.rfidTag}`).subscribe({
      next: (response) => {
        if (response.success && response.user) {
          console.log('✅ User found:', response.user);
          
          // Auto-login with temporary token (in production, implement proper RFID auth)
          // For now, we'll just redirect or ask for password
          this.error = 'Badge recognized! Please enter your password to complete login.';
          this.email = response.user.email;
          this.switchMode('email');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Badge not found:', err);
        this.error = 'Badge not registered. Please register first.';
        this.loading = false;
      }
    });
  }
  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}