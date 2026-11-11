import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../service/userService';
import { Sidebar } from '../../layout/sidebar/sidebar';

/**
 * Profile component responsible for displaying and managing
 * the authenticated user's personal information.
 * Allows users to update their name, email address and password.
 * Includes form validation, loading states and success or error messages.
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ ReactiveFormsModule, Sidebar],
  templateUrl: './profile.html'
})

export class Profile implements OnInit {

  // ==========================================
  // USER DATA
  // ==========================================

  // Stores the authenticated user's profile information.
  user: any = null;

  // ==========================================
  // COMPONENT STATE
  // ==========================================

  // Indicates whether the profile information is being loaded.
  loading = true;

  // Indicates whether a profile update operation is in progress.
  saving = false;

  // Stores error messages displayed when an operation fails.
  error = '';

  // Stores success messages displayed after a successful operation.
  success = '';

  // ==========================================
  // PROFILE FORM
  // ==========================================

  // Reactive form used to manage and validate the user's profile information.
  profileForm!: FormGroup;

  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  /**
   * Initializes the form builder to create and manage the reactive form
   * and the user service to retrieve and update profile information.
   */
  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  // ==========================================
  // INITIALIZATION
  // ==========================================

  /**
   * Initializes the profile component.
   * Creates the reactive form with the required fields and validators,
   * then retrieves the authenticated user's profile information.
   */
  ngOnInit(): void {

    // Creates the profile form and defines its initial values and validators.
    this.profileForm = this.fb.group({

      // Stores the user's name.
      name: [''],

      // Stores the user's email address and validates its format.
      email: ['', Validators.email],

      // Stores the user's current password when changing credentials.
      currentPassword: [''],

      // Stores the new password provided by the user.
      newPassword: ['']
    });

    // Retrieves the authenticated user's profile information.
    this.loadProfile();
  }

  // ==========================================
  // LOAD USER PROFILE
  // ==========================================

  /**
   * Retrieves the authenticated user's profile information from the API.
   * Updates the component data and populates the form with the received values.
   * Clears previous messages and manages the loading state.
   *
   * Displays an appropriate error message if the request fails.
   */
  loadProfile(): void {

    // Activates the loading state and clears previous messages.
    this.loading = true;
    this.error = '';
    this.success = '';

    // Requests the authenticated user's information from the user service.
    this.userService.getMe().subscribe({

      // Handles the successful response containing the user's profile.
      next: (data) => {

        // Logs the retrieved profile information for debugging purposes.
        console.log('Perfil carregado:', data);

        // Stores the authenticated user's profile information.
        this.user = data;

        // Updates the form fields with the retrieved user information.
        // Password fields are always cleared for security reasons.
        this.profileForm.patchValue({
          name: data.name ?? '',
          email: data.email ?? '',
          currentPassword: '',
          newPassword: ''
        });

        // Indicates that the profile loading process has finished.
        this.loading = false;
      },

      // Handles errors that occur while retrieving the user profile.
      error: (error) => {

        // Logs detailed information about the failed request.
        console.error('========== ERROR LOADING PROFILE ==========');
        console.error('Status:', error.status);
        console.error('Status text:', error.statusText);
        console.error('URL:', error.url);
        console.error('Backend response:', error.error);

        // Displays the backend error message when available.
        // Uses a default message if the backend does not provide one.
        this.error =
          error?.error?.error
          ?? error?.error?.message
          ?? 'Unable to load profile.';

        // Stops the loading state after the failed request.
        this.loading = false;
      }
    });
  }

  // ==========================================
  // UPDATE USER PROFILE
  // ==========================================

  /**
   * Handles the profile update operation.
   *
   * Validates the form, prepares the update payload
   * and sends the modified information to the backend.
   *
   * Supports updating the user's name, email address and password.
   * Password changes require both the current and new passwords.
   *
   * Displays a success message after a successful update
   * or an appropriate error message if the operation fails.
   */
  updateProfile(): void {

    // ------------------------------------------
    // FORM VALIDATION
    // ------------------------------------------

    /*
     * Prevents submission if the form is invalid
     * or another save operation is already in progress.
     */
    if (this.profileForm.invalid || this.saving) {
      return;
    }

    // Activates the saving state and clears previous messages.
    this.saving = true;
    this.error = '';
    this.success = '';

    // Retrieves the current values entered in the form.
    const formValue = this.profileForm.value;

    // Initializes an empty object containing only the fields
    // that need to be updated.
    const updateData: {
      name?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    } = {};

    // ------------------------------------------
    // UPDATE NAME
    // ------------------------------------------

    /*
     * Adds the name to the update payload only when it is a valid,
     * non-empty string. Removes unnecessary spaces before submission.
     */
    if (
      typeof formValue.name === 'string'
      && formValue.name.trim() !== ''
    ) {
      updateData.name = formValue.name.trim();
    }

    // ------------------------------------------
    // UPDATE EMAIL
    // ------------------------------------------

    /*
     * Adds the email address to the update payload only when it is
     * a valid, non-empty string. Removes unnecessary spaces.
     */
    if (
      typeof formValue.email === 'string'
      && formValue.email.trim() !== ''
    ) {
      updateData.email = formValue.email.trim();
    }

    // ------------------------------------------
    // UPDATE PASSWORD
    // ------------------------------------------

    // Retrieves the current password, ensuring the value is a string.
    const currentPassword =
      typeof formValue.currentPassword === 'string'
        ? formValue.currentPassword
        : '';

    // Retrieves the new password, ensuring the value is a string.
    const newPassword =
      typeof formValue.newPassword === 'string'
        ? formValue.newPassword
        : '';

    /*
     * Checks whether the user intends to change their password.
     * If either password field is filled in, both fields become mandatory.
     */
    if (
      currentPassword !== ''
      || newPassword !== ''
    ) {

      // Ensures that both password fields have been completed.
      if (
        currentPassword === ''
        || newPassword === ''
      ) {

        // Displays an error when one of the password fields is missing.
        this.error =
          'Enter both your current password and your new password.';

        // Stops the saving process.
        this.saving = false;

        return;
      }

      // ------------------------------------------
      // NEW PASSWORD VALIDATION
      // ------------------------------------------

      // Ensures that the new password contains at least 8 characters.
      if (newPassword.length < 8) {

        // Displays an error when the password does not meet
        // the minimum length requirement.
        this.error =
          'The new password must contain at least 8 characters.';

        // Stops the saving process.
        this.saving = false;

        return;
      }

      // Adds both password fields to the update payload.
      updateData.currentPassword = currentPassword;
      updateData.newPassword = newPassword;
    }

    // ------------------------------------------
    // CHECK FOR CHANGES
    // ------------------------------------------

    /*
     * Checks whether the update payload contains any fields.
     * Prevents unnecessary requests when there is nothing to update.
     */
    if (Object.keys(updateData).length === 0) {

      // Informs the user that no changes have been made.
      this.success = 'No changes to save.';

      // Stops the saving process.
      this.saving = false;

      return;
    }

    // ------------------------------------------
    // DEBUG INFORMATION
    // ------------------------------------------

    // Logs the update operation for debugging purposes.
    console.log(
      '========== UPDATE PROFILE =========='
    );

    // Displays the data being sent to the backend.
    console.log(
      'Data sent to /api/me:',
      updateData
    );

    // ------------------------------------------
    // SEND PROFILE UPDATE REQUEST
    // ------------------------------------------

    // Sends the updated profile information to the backend.
    this.userService.updateMe(updateData).subscribe({

      // Handles the successful profile update response.
      next: (data) => {

        // Logs the updated profile information.
        console.log(
          'Profile updated:',
          data
        );

        // Updates the local user data with the latest information.
        this.user = data;

        // Displays a success message to the user.
        this.success =
          'Profile updated successfully.';

        // Clears any previous error messages.
        this.error = '';

        // Indicates that the saving process has finished.
        this.saving = false;

        /*
         * Updates the form with the latest name and email address.
         * Clears both password fields to prevent sensitive information
         * from remaining in the form after a successful update.
         */
        this.profileForm.patchValue({
          name: data.name ?? '',
          email: data.email ?? '',
          currentPassword: '',
          newPassword: ''
        });
      },

      // Handles errors that occur while updating the profile.
      error: (error) => {

        // Logs detailed information about the failed update request.
        console.error(
          '========== ERROR UPDATING PROFILE =========='
        );

        console.error(
          'Status:',
          error.status
        );

        console.error(
          'Status text:',
          error.statusText
        );

        console.error(
          'URL:',
          error.url
        );

        console.error(
          'Complete error:',
          error
        );

        console.error(
          'Backend response:',
          error.error
        );

        // Logs the specific backend error, when available.
        console.error(
          'Backend error:',
          error?.error?.error
        );

        console.error(
          'Backend message:',
          error?.error?.message
        );

        // Displays the error message returned by the backend.
        // Uses a default message if no specific message is available.
        this.error =
          error?.error?.error
          ?? error?.error?.message
          ?? 'Unable to update profile.';

        // Stops the saving process after the failed request.
        this.saving = false;
      }
    });
  }
}
