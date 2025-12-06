// src/app/core/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanMatch {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canMatch(route: Route, segments: UrlSegment[]): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Redirect to login and prevent access
    this.router.navigate(['/login']);
    return false;
  }
}