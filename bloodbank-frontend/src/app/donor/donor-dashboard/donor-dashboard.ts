import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../auth/auth';
import { Donor, DonorProfile } from '../donor';
import { Request, DonationRecord } from '../../requests/request';

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donor-dashboard.html',
  styleUrl: './donor-dashboard.css'
})
export class DonorDashboard implements OnInit {
  profile: DonorProfile | null = null;
  hasProfile = false;

  bloodGroup = '';
  weight: number | null = null;
  age: number | null = null;

  records: DonationRecord[] = [];

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: Auth,
    private donorService: Donor,
    private requestService: Request,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadOffers();
  }

  loadProfile(): void {
    this.donorService.getMyProfile().subscribe({
      next: (response: any) => {
        const profiles = Array.isArray(response) ? response : response.results;
        if (profiles && profiles.length > 0) {
          this.profile = profiles[0];
          this.hasProfile = true;
          this.bloodGroup = profiles[0].blood_group;
          this.weight = profiles[0].weight;
          this.age = profiles[0].age;
        }
      },
      error: () => {
        this.errorMessage = 'Could not load profile.';
      }
    });
  }

  loadOffers(): void {
    this.requestService.getMyDonationRecords().subscribe({
      next: (response: any) => {
        this.records = Array.isArray(response) ? response : response.results;
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.bloodGroup === '' || this.weight === null || this.age === null) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const data: DonorProfile = {
      blood_group: this.bloodGroup,
      weight: this.weight,
      age: this.age
    };

    if (this.hasProfile && this.profile?.id) {
      this.donorService.updateProfile(this.profile.id, data).subscribe({
        next: (updated) => {
          this.profile = updated;
          this.successMessage = 'Profile updated.';
        },
        error: () => {
          this.errorMessage = 'Update failed.';
        }
      });
    } else {
      this.donorService.createProfile(data).subscribe({
        next: (created) => {
          this.profile = created;
          this.hasProfile = true;
          this.successMessage = 'Profile created.';
        },
        error: () => {
          this.errorMessage = 'Could not create profile.';
        }
      });
    }
  }

  accept(recordId: number): void {
    this.requestService.acceptRecord(recordId).subscribe({
      next: () => {
        this.successMessage = 'Donation accepted.';
        this.loadOffers();
      },
      error: () => this.errorMessage = 'Could not accept offer.'
    });
  }

  decline(recordId: number): void {
    this.requestService.declineRecord(recordId).subscribe({
      next: () => {
        this.successMessage = 'Donation declined.';
        this.loadOffers();
      },
      error: () => this.errorMessage = 'Could not decline offer.'
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}