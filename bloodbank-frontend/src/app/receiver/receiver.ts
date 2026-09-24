import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReceiverProfile {
  id?: number;
  hospital_name: string;
  contact_number: string;
}

@Injectable({
  providedIn: 'root'
})
export class Receiver {
  private apiUrl = 'http://127.0.0.1:8000/api/receivers/';

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<ReceiverProfile[]> {
    return this.http.get<ReceiverProfile[]>(this.apiUrl, this.authHeaders());
  }

  createProfile(data: ReceiverProfile): Observable<ReceiverProfile> {
    return this.http.post<ReceiverProfile>(this.apiUrl, data, this.authHeaders());
  }

  updateProfile(id: number, data: ReceiverProfile): Observable<ReceiverProfile> {
    return this.http.put<ReceiverProfile>(`${this.apiUrl}${id}/`, data, this.authHeaders());
  }

  private authHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }
}
