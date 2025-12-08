import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loading = false;
  tokenValid = false;
  invalidToken = false;
  resetSuccess = false;
  userEmail = '';
  private token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Get token from URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    
    console.log('🔗 Token from URL:', this.token);
    console.log('📍 Full URL:', window.location.href);
    console.log('🔍 Query params:', this.route.snapshot.queryParamMap.keys);

    if (!this.token) {
      console.error('❌ No token found in URL');
      this.invalidToken = true;
      this.toastr.error('No reset token provided');
      return;
    }

    console.log('✅ Token found, verifying...');

    // Verify token is valid
    this.authService.verifyResetToken(this.token).subscribe({
      next: (response) => {
        console.log('✅ Token verified:', response);
        this.tokenValid = true;
        this.userEmail = response.email || '';
      },
      error: (error) => {
        console.error('❌ Invalid token error:', error.error);
        this.invalidToken = true;
        this.toastr.error(error.error?.message || 'Invalid or expired reset token');
      }
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.toastr.error('Please fix the errors in the form');
      return;
    }

    this.loading = true;
    const newPassword = this.resetPasswordForm.get('newPassword')?.value;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (response) => {
        console.log('✅ Password reset successful:', response);
        this.resetSuccess = true;
        this.loading = false;
        this.toastr.success(response.message);
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Error resetting password:', error);
        this.loading = false;
        this.toastr.error(error.error?.message || 'Error resetting password');
      }
    });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}