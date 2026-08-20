import { Component, inject, OnInit } from "@angular/core";
import { UserService } from "../../service/userService";
import { AuthService } from "../../service/AuthService";
import { UserModel } from "../../models/user";
import { Sidebar } from "../../layout/sidebar/sidebar";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './user.html',
})
export class User implements OnInit {

  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  users: UserModel[] = [];
  loading = false;
  error = '';

  readonly currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.error = 'Error loading users.';
        this.loading = false;
      }
    });
  }

  isAdmin(user: { roles: string[] }): boolean {
    return user.roles.includes('ROLE_ADMIN');
  }

  canDelete(user: UserModel): boolean {
    const currentUser = this.currentUser();

    if (!currentUser) {
      return false;
    }

    // Apenas administradores podem eliminar utilizadores
    if (!this.isAdmin(currentUser)) {
      return false;
    }

    // Um admin pode eliminar utilizadores normais
    if (!this.isAdmin(user)) {
      return true;
    }

    // Um admin NÃO pode eliminar outro admin.
    // Pode eliminar apenas a própria conta.
    return currentUser.email === user.email;
  }

  deleteUser(user: UserModel): void {
    if (!this.canDelete(user)) {
      return;
    }

    if (!confirm(`Are you sure you want to eliminate ${user.name}?`)) {
      return;
    }

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(
          currentUser => currentUser.id !== user.id
        );
      },
      error: (error) => {
        console.error(error);
        this.error = 'The user could not be deleted.';
      }
    });
  }
}
