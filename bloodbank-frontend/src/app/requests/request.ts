import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BloodRequest {
  id?: number;
  receiver?: number;
  hospital_name_snapshot?: string;
  blood_group_needed: string;
  units_needed: number;
  status?: string;
  created_at?: string;
}

export interface MatchedDonor {
  id: number;
  blood_group: string;
  weight: number;
  age: number;
  is_eligible: boolean;
}

export interface DonationRecord {
  id: number;
  donor: number;
  request: number;
  status: string;
  date: string;
  request_detail?: BloodRequest;
}

@Injectable({
  providedIn: 'root'
})
export class Request {
  private apiUrl = 'http://127.0.0.1:8000/api/requests/blood-requests/';
  private recordsUrl = 'http://127.0.0.1:8000/api/requests/donation-records/';

  constructor(private http: HttpClient) {}

  getMyRequests(): Observable<BloodRequest[]> {
    return this.http.get<BloodRequest[]>(this.apiUrl, this.authHeaders());
  }

  createRequest(data: BloodRequest): Observable<BloodRequest> {
    return this.http.post<BloodRequest>(this.apiUrl, data, this.authHeaders());
  }

  getMatches(requestId: number): Observable<MatchedDonor[]> {
    return this.http.get<MatchedDonor[]>(`${this.apiUrl}${requestId}/matches/`, this.authHeaders());
  }

  offerDonor(requestId: number, donorId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${requestId}/offer/`, { donor_id: donorId }, this.authHeaders());
  }

  getMyDonationRecords(): Observable<DonationRecord[]> {
    return this.http.get<DonationRecord[]>(this.recordsUrl, this.authHeaders());
  }

  acceptRecord(recordId: number): Observable<any> {
    return this.http.post(`${this.recordsUrl}${recordId}/accept/`, {}, this.authHeaders());
  }

  declineRecord(recordId: number): Observable<any> {
    return this.http.post(`${this.recordsUrl}${recordId}/decline/`, {}, this.authHeaders());
  }

  private authHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }
}