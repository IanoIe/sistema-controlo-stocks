import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../service/AuthService';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
})
export class Header implements OnInit {

  user: User | null = null;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }
}
