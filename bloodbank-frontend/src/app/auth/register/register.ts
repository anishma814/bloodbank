import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  username = '';
  email = '';
  password = '';
  role = 'donor';

  errorMessage = '';
  successMessage = '';

  constructor(private authService: Auth, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.username?.[0] || err.error?.detail || 'Registration failed. Please check your details.';
      }
    });
  }
}
