import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanMatch {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canMatch(route: Route, segments: UrlSegment[]): boolean {
    const user = this.authService.getCurrentUser();
    
    if (user && user.role === 'Manager') {
      return true;
    }

    this.router.navigate(['/tasks']);
    return false;
  }
}