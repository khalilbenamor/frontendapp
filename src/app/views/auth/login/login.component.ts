// src/app/views/auth/login/login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';

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
    IconDirective
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
      this.error = 'Veuillez saisir votre email et votre mot de passe.';
      return;
    }
    if (!this.email) {
      this.error = 'Veuillez saisir votre adresse email.';
      return;
    }
    if (!this.password) {
      this.error = 'Veuillez saisir votre mot de passe.';
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.error = 'Email ou mot de passe incorrect.';
        this.loading = false;
      }
    });
  }
}