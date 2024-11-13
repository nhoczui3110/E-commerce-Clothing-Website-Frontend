import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private router: Router) {}

  isAdminRoute() {
    return (
      this.router.url.startsWith('/admin') ||
      this.router.url.startsWith('/login') ||
      this.router.url.startsWith('/sign-up')
    );
  }
}
