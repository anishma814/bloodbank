import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: Auth, private router: Router) { }

  onSubmit(): void {
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        const role = this.authService.getRole();
        
        if (role === 'donor') {
          this.router.navigate(['/donor-dashboard']);
        } else if (role === 'receiver') {
          this.router.navigate(['/receiver-dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.errorMessage = 'Invalid username or password.';
      }
    });
  }
}
