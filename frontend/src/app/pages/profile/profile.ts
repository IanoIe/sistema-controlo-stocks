import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { UserService } from '../../service/userService';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ ReactiveFormsModule, Sidebar],
  templateUrl: './profile.html'
})

export class Profile implements OnInit {
  user: any = null;
  loading = true;
  saving = false;
  error = '';
  success = '';
  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [''],
      email: ['', Validators.email],
      currentPassword: [''],
      newPassword: ['']
    });
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = '';
    this.success = '';
    this.userService.getMe().subscribe({
      next: (data) => {
        console.log('Perfil carregado:', data);
        this.user = data;
        this.profileForm.patchValue({
          name: data.name ?? '',
          email: data.email ?? '',
          currentPassword: '',
          newPassword: ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('========== ERRO AO CARREGAR PERFIL ==========');
        console.error('Status:', error.status);
        console.error('Status text:', error.statusText);
        console.error('URL:', error.url);
        console.error('Resposta do backend:', error.error);
        this.error =
          error?.error?.error
          ?? error?.error?.message
          ?? 'Unable to load profile.';
        this.loading = false;
      }
    });
  }

  updateProfile(): void {
    /*
     * Do not submit if the form is invalid
     * or another save operation is running.
     */
    if (this.profileForm.invalid || this.saving) {
      return;
    }
    this.saving = true;
    this.error = '';
    this.success = '';
    const formValue = this.profileForm.value;
    const updateData: {
      name?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    } = {};

    /*
     * NAME
     */
    if (
      typeof formValue.name === 'string'
      && formValue.name.trim() !== ''
    ) {
      updateData.name = formValue.name.trim();
    }

    /*
     * EMAIL
     */
    if (
      typeof formValue.email === 'string'
      && formValue.email.trim() !== ''
    ) {
      updateData.email = formValue.email.trim();
    }

    /*
     * PASSWORD
     */
    const currentPassword =
      typeof formValue.currentPassword === 'string'
        ? formValue.currentPassword
        : '';

    const newPassword =
      typeof formValue.newPassword === 'string'
        ? formValue.newPassword
        : '';

    /*
     * If one password field is filled,
     * both fields are required.
     */
    if (
      currentPassword !== ''
      || newPassword !== ''
    ) {

      if (
        currentPassword === ''
        || newPassword === ''
      ) {

        this.error =
          'Enter both your current password and your new password.';

        this.saving = false;

        return;
      }

      /*
       * New password minimum length.
       */
      if (newPassword.length < 8) {

        this.error =
          'The new password must contain at least 8 characters.';

        this.saving = false;

        return;
      }

      updateData.currentPassword = currentPassword;
      updateData.newPassword = newPassword;
    }

    /*
     * Nothing to update.
     */
    if (Object.keys(updateData).length === 0) {

      this.success = 'No changes to save.';

      this.saving = false;

      return;
    }

    /*
     * DEBUG
     */
    console.log(
      '========== UPDATE PROFILE =========='
    );

    console.log(
      'Dados enviados para /api/me:',
      updateData
    );

    /*
     * Send update to backend.
     */
    this.userService.updateMe(updateData).subscribe({

      next: (data) => {

        console.log(
          'Perfil atualizado:',
          data
        );

        this.user = data;

        this.success =
          'Profile updated successfully.';

        this.error = '';

        this.saving = false;

        /*
         * Keep updated name/email.
         * Clear passwords.
         */
        this.profileForm.patchValue({
          name: data.name ?? '',
          email: data.email ?? '',
          currentPassword: '',
          newPassword: ''
        });
      },

      error: (error) => {

        console.error(
          '========== ERRO AO ATUALIZAR PERFIL =========='
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
          'Erro completo:',
          error
        );

        console.error(
          'Resposta do backend:',
          error.error
        );

        console.error(
          'Backend error:',
          error?.error?.error
        );

        console.error(
          'Backend message:',
          error?.error?.message
        );

        this.error =
          error?.error?.error
          ?? error?.error?.message
          ?? 'Unable to update profile.';

        this.saving = false;
      }
    });
  }
}
