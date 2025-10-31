import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';
  success: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Email and password are required';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.loading = false;
        this.success = '✓ Login successful! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/questions']);
        }, 1500);
      },
      (error) => {
        this.loading = false;
        this.error = error.error?.error || 'Login failed. Please try again.';
      }
    );
  }

  fillDemoCredentials(index: number): void {
    const credentials = [
      { email: 'john@example.com', password: 'password123' },
      { email: 'jane@example.com', password: 'securepass456' },
      { email: 'bob@example.com', password: 'mypass789' }
    ];
    
    this.email = credentials[index].email;
    this.password = credentials[index].password;
  }
}