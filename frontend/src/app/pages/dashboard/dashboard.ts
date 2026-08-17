import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    Sidebar,
  ],
  templateUrl: './dashboard.html',
})

export class Dashboard {
}
