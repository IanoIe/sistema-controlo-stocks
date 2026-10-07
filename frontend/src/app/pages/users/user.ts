import { Component, inject, OnInit } from "@angular/core";

import { UserService } from "../../service/userService";
import { UserModel } from "../../models/user";
import { Sidebar } from "../../layout/sidebar/sidebar";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    Sidebar
  ],
  templateUrl: './user.html',
})
export class User implements OnInit {

  private readonly userService = inject(UserService);

  users: UserModel[] = [];

  loading = false;
  error = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.loading = true;
    this.error = '';

    this.userService.getUsers().subscribe({

      next: (users) => {

        console.log('Users carregados:', users);

        this.users = users;

        this.loading = false;
      },

      error: (error) => {
        console.error('Erro ao carregar users:', error);
        if (error.status === 403) {
          this.error = 'You do not have permission to access the users list.';
        } else {
          this.error = 'Unable to load users.';
        }
        this.loading = false;
      }
    });
  }

  getRole(user: UserModel): string {
    return user.roles.includes('ROLE_ADMIN') ? 'Admin' : 'User';
  }
}
