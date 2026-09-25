import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const http = inject(HttpClient);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/')) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          router.navigate(['/login']);
          return throwError(() => error);
        }

        return http.post<{ access: string }>('http://127.0.0.1:8000/api/auth/refresh/', {
          refresh: refreshToken
        }).pipe(
          switchMap((res) => {
            localStorage.setItem('access_token', res.access);
            const retriedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.access}` }
            });
            return next(retriedReq);
          }),
          catchError((refreshError) => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};