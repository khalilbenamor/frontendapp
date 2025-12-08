import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // For notifications

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  loading = false;
  emailSent = false;
  sentEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.toastr.error('Veuillez entrer une adresse email valide');
      return;
    }

    this.loading = true;
    const email = this.forgotPasswordForm.get('email')?.value;

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        console.log('✅ Reset email sent:', response);
        this.emailSent = true;
        this.sentEmail = email;
        this.loading = false;
        this.toastr.success(response.message);
      },
      error: (error) => {
        console.error('❌ Error sending reset email:', error);
        this.loading = false;
        this.toastr.error(error.error?.message || 'Erreur lors de l\'envoi du lien de réinitialisation');
      }
    });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  resendEmail() {
    this.emailSent = false;
    this.forgotPasswordForm.reset();
  }
}