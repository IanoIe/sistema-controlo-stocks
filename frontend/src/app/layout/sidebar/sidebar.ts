import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  NavigationEnd
} from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html'
})

export class Sidebar implements OnInit, OnDestroy {
  activeSection: 'products' | 'categories' | null = null;
  private routerSubscription?: Subscription;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateActiveSection();
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd)
    )
      .subscribe(() => this.updateActiveSection());
  }

  private updateActiveSection(): void {
    const url = this.router.url;
    const path = url.split('?')[0];
    const returnTo = new URLSearchParams(
      url.split('?')[1] ?? ''
    ).get('returnTo');

    if (path === '/categories' ||
      path.startsWith('/categories/') ||
      returnTo?.startsWith('/categories/')
    ) {
      this.activeSection = 'categories';
    } else if (path === '/products') {
      this.activeSection = 'products';
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}
