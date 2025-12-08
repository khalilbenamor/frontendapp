import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Get the token from LocalStorage
  const token = localStorage.getItem('token');
  
  // DEBUG: Log the token and request
  console.log('=== AUTH INTERCEPTOR ===');
  console.log('Token from localStorage:', token);
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);

  // 2. If token exists, clone the request and add the header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Added Authorization header:', clonedRequest.headers.get('Authorization'));
    return next(clonedRequest);
  }

  // 3. If no token, just send the original request
  console.log('No token found - sending request without auth');
  return next(req);
};