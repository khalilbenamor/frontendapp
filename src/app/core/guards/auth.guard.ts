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
        console.log('AuthGuard canMatch called', { route: route.path, segments });
        
        if (this.authService.isLoggedIn()) {
            console.log('User is logged in');
            return true; // Allow access to protected layout
        }

        // Redirect to login if not logged in
        console.log('User not logged in, redirecting to /login');
        this.router.navigate(['/login']);
        return false;
    }
}