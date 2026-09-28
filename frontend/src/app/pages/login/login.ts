import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/AuthService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})

export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  email = '';
  password = '';
  error = '';
  onSubmit(): void {
    this.error = '';
    const payload = {
      email: this.email,
      password: this.password
    };
    this.authService.login(payload).subscribe({
      next: (response) => {
        console.log('LOGIN OK:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
        if (error.status === 401) {
          this.error = 'Incorrect email or password.';
        } else {
          this.error = 'An error occurred while logging in. Please try again.';
        }
      }
    });
  }
}
