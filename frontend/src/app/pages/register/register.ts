
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { RegisterModel } from "../../models/user";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html'
})
export class Register {

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  error = '';
  success = '';
  loading = false;

  private readonly apiUrl = `${environment.apiUrl}/register`;

  onSubmit(): void {

    if (this.loading) return;

    this.error = '';
    this.success = '';

    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'Password must contain at least 8 characters.';
      return;
    }

    const payload: RegisterModel = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password
    };

    this.loading = true;

    this.http.post(this.apiUrl, payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Account created successfully!';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      error: (err) => {
        this.loading = false;
        console.error('Registration error:', err);

        if (err.status === 409) {
          this.error = 'This email is already registered.';
        } else if (err.status === 400) {
          this.error = err.error?.message || 'Invalid registration data.';
        } else {
          this.error = 'An error occurred while creating your account.';
        }
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
