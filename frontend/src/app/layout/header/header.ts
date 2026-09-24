import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user';
import { UserService } from '../../service/userService';
import { AuthService } from '../../service/AuthService';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
})
export class Header implements OnInit {

  user: UserModel | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.userService.getMe().subscribe({
      next: (user) => {
        console.log('Utilizador autenticado:', user);
        this.user = user;
      },
      error: (error) => {
        console.error('Error getting user:', error);
      }
    });
  }
}
