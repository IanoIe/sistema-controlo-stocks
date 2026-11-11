import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../service/AuthService';
import { User } from '../../models/user';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html'
})

export class Sidebar implements OnInit, OnDestroy {
  // Identifies the currently active section in the sidebar.
  activeSection: 'products' | 'categories' | null = null;
  // Stores the currently authenticated user's information.
  currentUser: User | null = null;
  // Subscription used to track navigation changes.
  private routerSubscription?: Subscription;
  // Subscription used to track authenticated user changes.
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Initializes the component.
   * Subscribes to authenticated user changes, loads user information
   * if it is not yet available, and monitors route changes to update
   * the active sidebar section.
   */
  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    // Loads the current user's information if authenticated
    // but no user data is currently available.
    if (this.authService.isAuthenticated() && !this.currentUser) {
      this.authService.loadCurrentUser().subscribe();
    }
    // Updates the active section based on the current route.
    this.updateActiveSection();
    // Listens for navigation events and updates the active section
    // whenever the route changes.
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateActiveSection());
  }

  /**
   * Determines which sidebar section should be active
   * by analysing the current URL and the returnTo parameter, if present.
   */
  private updateActiveSection(): void {
    const url = this.router.url;
    const path = url.split('?')[0];
    const returnTo = new URLSearchParams(url.split('?')[1] ?? '').get('returnTo');
    // Activates the categories section when the user navigates
    // to a categories-related route.
    if (path === '/categories' || path.startsWith('/categories/') || returnTo?.startsWith('/categories/')) {
      this.activeSection = 'categories';
    // Activates the products section when the user navigates
    // to the main products page.
    } else if (path === '/products') {
      this.activeSection = 'products';
    }
  }

  /**
   * Cleans up existing subscriptions when the component is destroyed,
   * preventing potential memory leaks.
   */
  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

  /**
   * Logs out the currently authenticated user.
   * Requests confirmation before proceeding and redirects
   * the user to the login page once the logout operation succeeds.
   */
  logout(): void {
    const confirmed = confirm('Are you sure you want to log out?');
    // Cancels the logout operation if the user does not confirm.
    if (!confirmed) {
      return;
    }
    // Executes the logout operation through the authentication service.
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
