import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch {
  constructor(private router: Router) {}

  canMatch(route: Route, segments: UrlSegment[]):
    boolean | Observable<boolean> | Promise<boolean> {
    // TODO: replace with real auth check
    const isAuthenticated = true;
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
    }
    return isAuthenticated;
  }
}