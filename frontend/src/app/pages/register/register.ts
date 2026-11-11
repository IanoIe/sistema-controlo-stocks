import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { RegisterModel } from "../../models/user";
import { environment } from "../../../environments/environment";

/**
 * Register component responsible for creating new user accounts.
 * Allows users to provide their personal information and credentials,
 * validates the registration form and sends the data to the backend.
 * Redirects users to the login page after successful registration.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html'
})
export class Register {

  // ==========================================
  // DEPENDENCIES
  // ==========================================

  // Injects HttpClient to send HTTP requests to the backend API.
  private readonly http = inject(HttpClient);

  // Injects the router to handle navigation between application pages.
  private readonly router = inject(Router);

  // ==========================================
  // REGISTRATION FORM DATA
  // ==========================================

  // Stores the name entered by the user.
  name = '';

  // Stores the email address entered by the user.
  email = '';

  // Stores the password entered by the user.
  password = '';

  // Stores the password confirmation entered by the user.
  confirmPassword = '';

  // ==========================================
  // FORM STATE
  // ==========================================

  // Stores error messages displayed when registration fails.
  error = '';

  // Stores success messages displayed after successful registration.
  success = '';

  // Indicates whether a registration request is currently in progress.
  loading = false;

  // ==========================================
  // API CONFIGURATION
  // ==========================================

  // Defines the backend API endpoint used to register new users.
  private readonly apiUrl = `${environment.apiUrl}/register`;

  // ==========================================
  // REGISTER USER
  // ==========================================

  /**
   * Handles the registration form submission.
   *
   * Validates the required fields, checks whether the passwords match
   * and ensures that the password meets the minimum length requirement.
   *
   * Sends the registration data to the backend API.
   * Displays an appropriate success or error message depending
   * on the result of the request.
   *
   * Redirects the user to the login page after successful registration.
   */
  onSubmit(): void {

    // Prevents multiple registration requests while one is in progress.
    if (this.loading) return;

    // Clears previous error and success messages.
    this.error = '';
    this.success = '';

    // ------------------------------------------
    // REQUIRED FIELD VALIDATION
    // ------------------------------------------

    // Checks whether all required registration fields have been completed.
    if (!this.name.trim() || !this.email.trim() || !this.password || !this.confirmPassword)
      {
        // Displays an error message when a required field is missing.
        this.error = 'Please fill in all required fields.';
        return;
      }

    // ------------------------------------------
    // PASSWORD CONFIRMATION
    // ------------------------------------------

    // Checks whether the password and confirmation fields match.
    if (this.password !== this.confirmPassword)
        {
          // Displays an error message when the passwords do not match.
          this.error = 'Passwords do not match.';
          return;
        }

    // ------------------------------------------
    // PASSWORD LENGTH VALIDATION
    // ------------------------------------------

    // Ensures that the password contains at least 8 characters.
    if (this.password.length < 8)
          {
            // Displays an error message when the password is too short.
            this.error = 'Password must contain at least 8 characters.';
            return;
          }

    // ------------------------------------------
    // PREPARE REGISTRATION DATA
    // ------------------------------------------

    // Creates the registration payload using the validated form values.
    // Removes unnecessary spaces from the name and email address.
    const payload: RegisterModel = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password
    };

    // ------------------------------------------
    // SEND REGISTRATION REQUEST
    // ------------------------------------------

    // Activates the loading state while the registration request is running.
    this.loading = true;

    // Sends the registration data to the backend API.
    this.http.post(this.apiUrl, payload).subscribe({

      // Handles the successful registration response.
      next: () => {

        // Indicates that the registration request has finished.
        this.loading = false;

        // Displays a success message confirming account creation.
        this.success = 'Account created successfully!';

        // Redirects the user to the login page after 1.5 seconds.
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      // Handles errors returned by the backend during registration.
      error: (err) => {

        // Stops the loading state after the failed request.
        this.loading = false;

        // Logs the registration error for debugging purposes.
        console.error('Registration error:', err);

        // ------------------------------------------
        // HANDLE HTTP ERROR RESPONSES
        // ------------------------------------------

        // Handles the conflict response when the email is already registered.
        if (err.status === 409) {
          this.error = 'This email is already registered.';

        // Handles invalid registration data returned by the backend.
        } else if (err.status === 400) {
          this.error = err.error?.message || 'Invalid registration data.';

        // Handles unexpected errors during account creation.
        } else {
          this.error = 'An error occurred while creating your account.';
        }
      }
    });
  }

  // ==========================================
  // NAVIGATE TO LOGIN
  // ==========================================

  /**
   * Redirects the user to the login page.
   * Allows users who already have an account to access the application.
   */
  goToLogin(): void {

    // Navigates to the login page.
    this.router.navigate(['/login']);
  }
}
