import { Component, inject } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { Router } from '@angular/router';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle]
})
export class LoginComponent {
  private router = inject(Router);
}
// Inside your Login Component or AuthService
this.http.post('http://localhost:3000/api/auth/login', credentials).subscribe({
  next: (response: any) => {
    if (response.success) {
      // SAVE THE TOKEN HERE
      localStorage.setItem('token', response.token); 
      
      // Save user info if needed
      localStorage.setItem('user', JSON.stringify(response.user));
      
      this.router.navigate(['/dashboard']);
    }
  }
});
