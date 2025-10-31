import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  error: string = '';
  success: string = '';

  constructor(private authService: AuthService, private router: Router) {}
isValidEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.email);
  }
  register(): void {
    // Validation
    if (!this.email || !this.password || !this.confirmPassword) {
      this.error = 'All fields are required';
      return;
    }
     if (!this.isValidEmail()) {
      this.error = 'Please enter a valid email address';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.register(this.email, this.password, this.confirmPassword).subscribe(
      (response) => {
        this.loading = false;
        this.success = '✓ Registration successful! Redirecting to login...';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      },
      (error) => {
        this.loading = false;
        this.error = error.error?.error || 'Registration failed. Please try again.';
      }
    );
  }
}