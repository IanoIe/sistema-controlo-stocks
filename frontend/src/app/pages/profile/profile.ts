import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/AuthService';
import { UserModel } from '../../models/user';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-profile',
  imports: [Sidebar],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {

  user: UserModel | null = null;
  loading = true;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.authService.loadCurrentUser().subscribe({
      next: (user) => {
        console.log('PROFILE USER:', user);

        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        console.error('PROFILE ERROR:', error);

        this.loading = false;
      }
    });
  }
}
