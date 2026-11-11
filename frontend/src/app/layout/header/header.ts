import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../service/AuthService';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
})

export class Header implements OnInit {

  // Stores the currently authenticated user's information.
  user: User | null = null;

  constructor(
    private authService: AuthService
  ) {}

  /**
   * Initializes the component and subscribes to changes
   * in the authenticated user information.
   * Updates the user property whenever the current user changes.
   */
  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }
}
