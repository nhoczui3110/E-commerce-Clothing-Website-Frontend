// auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const expectedRole = route.data.role; // Lấy role yêu cầu từ route
    const userRole = this.authService.getRole(); // Lấy role từ token đã lưu
    console.log('===============================');
    console.log(userRole.toLowerCase().trim());
    if (
      !this.authService.isLoggedIn() ||
      userRole.toLowerCase().trim() !== expectedRole.toLowerCase().trim()
    ) {
      this.authService.returnUrl = state.url.split('?')[0];
      console.log('==============================');
      console.log(state.url.split('?')[0]);
      this.router.navigate(['/login']); // Điều hướng nếu không có quyền
      return false;
    }
    if (userRole.toLowerCase().trim() === 'admin') {
      this.authService.returnUrl = '/admin';
    }
    return true;
  }
}
