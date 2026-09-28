import { Component, inject, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";

import { UserService } from "../../service/userService";
import { AuthService } from "../../service/AuthService";
import { UserModel } from "../../models/user";
import { Sidebar } from "../../layout/sidebar/sidebar";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    Sidebar,
    ReactiveFormsModule
  ],
  templateUrl: './user.html',
})
export class User implements OnInit {

  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  user: UserModel | null = null;

  loading = false;
  saving = false;

  error = '';
  success = '';

  readonly currentUser = this.authService.currentUser;

  readonly profileForm = this.fb.nonNullable.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      ''
    ]

  });


  ngOnInit(): void {
    this.loadProfile();
  }


  loadProfile(): void {

    this.loading = true;
    this.error = '';

    this.userService.getMe().subscribe({

      next: (user) => {

        this.user = user;

        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });

        this.loading = false;
      },

      error: (error) => {

        console.error(error);

        this.error = 'Unable to load your profile.';
        this.loading = false;
      }

    });

  }


  updateProfile(): void {

    if (this.profileForm.invalid) {

      this.profileForm.markAllAsTouched();

      return;
    }

    this.saving = true;
    this.error = '';
    this.success = '';


    const formValue = this.profileForm.getRawValue();

    const data: {
      name: string;
      email: string;
      password?: string;
    } = {
      name: formValue.name,
      email: formValue.email
    };


    if (formValue.password.trim() !== '') {
      data.password = formValue.password;
    }


    this.userService.updateMe(data).subscribe({

      next: (user) => {

        this.user = user;

        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          password: ''
        });

        this.success = 'Profile updated successfully.';
        this.saving = false;

      },

      error: (error) => {

        console.error(error);

        this.error = 'Unable to update your profile.';
        this.saving = false;

      }

    });

  }

}
