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
    console.log('ManagerGuard canMatch called');
    
    const user = this.authService.getCurrentUser();
    
    if (user && user.role === 'Manager') {
      console.log('User is a Manager, allowing access');
      return true;
    }

    // Redirect to tasks page if not a manager
    console.log('User is not a Manager, redirecting to /tasks');
    this.router.navigate(['/tasks']);
    return false;
  }
}