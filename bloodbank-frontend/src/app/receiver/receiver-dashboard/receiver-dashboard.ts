import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../auth/auth';
import { Receiver, ReceiverProfile } from '../receiver';
import { Request, BloodRequest, MatchedDonor, DonationRecord } from '../../requests/request';

@Component({
  selector: 'app-receiver-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receiver-dashboard.html',
  styleUrl: './receiver-dashboard.css'
})
export class ReceiverDashboard implements OnInit {
  profile: ReceiverProfile | null = null;
  hasProfile = false;
  hospitalName = '';
  contactNumber = '';

  myRequests: BloodRequest[] = [];
  bloodGroupNeeded = '';
  unitsNeeded = 1;

  selectedRequestId: number | null = null;
  matches: MatchedDonor[] = [];
  matchesLoading = false;

  offeredDonorIds: Set<number> = new Set();
  records: DonationRecord[] = [];

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: Auth,
    private receiverService: Receiver,
    private requestService: Request,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadRequests();
    this.loadRecords();
  }

  loadProfile(): void {
    this.receiverService.getMyProfile().subscribe({
      next: (response: any) => {
        const profiles = Array.isArray(response) ? response : response.results;
        if (profiles && profiles.length > 0) {
          this.profile = profiles[0];
          this.hasProfile = true;
          this.hospitalName = profiles[0].hospital_name;
          this.contactNumber = profiles[0].contact_number;
        }
        this.cdr.detectChanges();
      }
    });
  }

  onSubmitProfile(): void {
    const data: ReceiverProfile = {
      hospital_name: this.hospitalName,
      contact_number: this.contactNumber
    };

    if (this.hasProfile && this.profile?.id) {
      this.receiverService.updateProfile(this.profile.id, data).subscribe({
        next: (updated) => {
          this.profile = updated;
          this.successMessage = 'Profile updated.';
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Update failed.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.receiverService.createProfile(data).subscribe({
        next: (created) => {
          this.profile = created;
          this.hasProfile = true;
          this.successMessage = 'Profile created.';
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Could not create profile.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  loadRequests(): void {
    this.requestService.getMyRequests().subscribe({
      next: (response: any) => {
        this.myRequests = Array.isArray(response) ? response : response.results;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmitRequest(): void {
    if (!this.bloodGroupNeeded || this.unitsNeeded < 1) {
      this.errorMessage = 'Please fill in the request fields.';
      return;
    }

    this.requestService.createRequest({
      blood_group_needed: this.bloodGroupNeeded,
      units_needed: this.unitsNeeded
    }).subscribe({
      next: () => {
        this.successMessage = 'Blood request created.';
        this.bloodGroupNeeded = '';
        this.unitsNeeded = 1;
        this.loadRequests();
      },
      error: () => {
        this.errorMessage = 'Could not create request.';
        this.cdr.detectChanges();
      }
    });
  }

  viewMatches(requestId: number): void {
    this.selectedRequestId = requestId;
    this.matches = [];
    this.matchesLoading = true;

    this.requestService.getMatches(requestId).subscribe({
      next: (response: any) => {
        this.matches = Array.isArray(response) ? response : response.results;
        this.matchesLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load matches.';
        this.matchesLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRecords(): void {
    this.requestService.getMyDonationRecords().subscribe({
      next: (response: any) => {
        this.records = Array.isArray(response) ? response : response.results;
        this.cdr.detectChanges();
      }
    });
  }

  getOfferStatus(donorId: number): string | null {
    const record = this.records.find(
      r => r.donor === donorId && r.request === this.selectedRequestId
    );
    return record ? record.status : null;
  }

  offerDonor(donorId: number): void {
    if (!this.selectedRequestId || this.offeredDonorIds.has(donorId)) return;

    this.requestService.offerDonor(this.selectedRequestId, donorId).subscribe({
      next: () => {
        this.successMessage = 'Offer sent to donor.';
        this.offeredDonorIds.add(donorId);
        this.loadRecords();
      },
      error: () => {
        this.errorMessage = 'Could not send offer.';
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}