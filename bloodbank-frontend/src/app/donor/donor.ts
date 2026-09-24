import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DonorProfile {
  id?: number;
  blood_group: string;
  weight: number;
  age: number;
  last_donation_date?: string | null;
  is_eligible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Donor {
  private apiUrl = 'http://127.0.0.1:8000/api/donors/';

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<DonorProfile[]> {
    return this.http.get<DonorProfile[]>(this.apiUrl, this.authHeaders());
  }

  createProfile(data: DonorProfile): Observable<DonorProfile> {
    return this.http.post<DonorProfile>(this.apiUrl, data, this.authHeaders());
  }

  updateProfile(id: number, data: DonorProfile): Observable<DonorProfile> {
    return this.http.put<DonorProfile>(`${this.apiUrl}${id}/`, data, this.authHeaders());
  }

  private authHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }
}
