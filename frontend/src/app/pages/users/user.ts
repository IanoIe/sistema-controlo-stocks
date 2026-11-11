
import { Component, inject, OnInit } from "@angular/core";
import { UserService } from "../../service/userService";
import { UserModel } from "../../models/user";
import { Sidebar } from "../../layout/sidebar/sidebar";

/**
 * User component responsible for managing and displaying user information.
 *
 * Retrieves user records from the backend and stores them in the component state.
 * Handles loading and error states during the data retrieval process.
 *
 * Provides functionality for identifying user roles and displaying
 * readable role labels based on the roles assigned by the backend.
 */
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './user.html',
})

export class User implements OnInit {
  // ==========================================
  // DEPENDENCIES
  // ==========================================
  // Injects the service responsible for retrieving user information.
  private readonly userService = inject(UserService);

  // ==========================================
  // USER DATA
  // ==========================================
  // Stores all user records retrieved from the backend API.
  users: UserModel[] = [];

  // ==========================================
  // COMPONENT STATES
  // ==========================================
  // Indicates whether user data is currently being loaded.
  loading = false;
  // Stores error messages displayed when an operation fails.
  error = '';

  // ==========================================
  // INITIALIZATION
  // ==========================================
  /**
   * Initializes the user component.
   *
   * Retrieves the existing user records from the backend
   * to populate the user collection.
   */
  ngOnInit(): void {
    // Load all registered users.
    this.loadUsers();
  }

  // ==========================================
  // LOAD USERS
  // ==========================================
  /**
   * Retrieves all user records from the backend.
   *
   * Updates the component state with the returned users
   * and manages the loading and error states during the request.
   *
   * Handles permission-related errors separately when the user
   * does not have authorization to access the users list.
   */
  loadUsers(): void {
    // Activates the loading indicator before requesting the data.
    this.loading = true;
    // Clears any previous error message.
    this.error = '';
    // Requests all registered users from the backend API.
    this.userService.getUsers().subscribe({
      // Handles the successful response from the backend.
      next: (users) => {
        // Logs the retrieved users for debugging purposes.
        console.log('Users carregados:', users);
        // Stores the retrieved user records.
        this.users = users;
        // Deactivates the loading indicator after receiving the data.
        this.loading = false;
      },
      // Handles errors returned while retrieving users.
      error: (error) => {
        // Logs the error for debugging purposes.
        console.error('Erro ao carregar users:', error);
        // Checks whether the request failed due to insufficient permissions.
        if (error.status === 403) {
          // Displays a permission-related error message.
          this.error = 'You do not have permission to access the users list.';
        } else {
          // Displays a general error message for other failures.
          this.error = 'Unable to load users.';
        }
        // Deactivates the loading indicator after the failed request.
        this.loading = false;
      }
    });
  }

  // ==========================================
  // GET USER ROLE
  // ==========================================
  /**
   * Determines the readable role label assigned to a user.
   *
   * Checks whether the user has the ROLE_ADMIN permission.
   * Returns Admin when the administrative role is present
   * and User otherwise.
   *
   * @param user - The user whose role needs to be identified.
   * @returns The readable role label associated with the user.
   */
  getRole(user: UserModel): string {
    // Check whether the user has the administrative role.
    // Return Admin when ROLE_ADMIN is present.
    // Otherwise, return User as the default role label.
    return user.roles.includes('ROLE_ADMIN') ? 'Admin' : 'User';
  }
}
