import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/AuthService';

/**
 * Login component responsible for handling user authentication.
 * Allows users to enter their credentials, authenticate
 * and navigate to the dashboard after a successful login.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})

export class Login {
  // Injects the authentication service to handle user login requests.
  private readonly authService = inject(AuthService);
  // Injects the router to handle application navigation.
  private readonly router = inject(Router);
  // Stores the email address entered by the user.
  email = '';
  // Stores the password entered by the user.
  password = '';
  // Stores the error message displayed when authentication fails.
  error = '';

  /**
   * Handles the login form submission.
   * Clears previous error messages, sends the user's credentials
   * to the authentication service and processes the server response.
   *
   * On successful authentication, redirects the user to the dashboard.
   * Displays an appropriate error message if authentication fails.
   */
  onSubmit(): void {
    // Clears any previous authentication error message.
    this.error = '';
    // Creates the payload containing the user's login credentials.
    const payload = {
      email: this.email,
      password: this.password
    };
    // Sends the login request to the authentication service.
    this.authService.login(payload).subscribe({
      // Handles a successful authentication response.
      next: (response) => {
        // Logs the successful login response for debugging purposes.
        console.log('LOGIN OK:', response);
        // Redirects the authenticated user to the dashboard.
        this.router.navigate(['/dashboard']);
      },
      // Handles authentication errors returned by the server.
      error: (error) => {
        // Logs the login error for debugging purposes.
        console.error('Login error:', error);
        // Displays a specific message when the credentials are incorrect.
        if (error.status === 401) {
          this.error = 'Incorrect email or password.';
        } else {
          // Displays a general error message for other authentication failures.
          this.error = 'An error occurred while logging in. Please try again.';
        }
      }
    });
  }

  /**
   * Redirects the user to the registration page
   * to create a new account.
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
