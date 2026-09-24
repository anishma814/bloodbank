import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  register(data: { username: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register/`, data);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login/`, { username, password })
      .pipe(tap(res => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
      }));
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
  const token = this.getToken();
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.role ?? null;
}
}
