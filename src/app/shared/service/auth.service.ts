// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { errorHandler } from '../error-handler';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  returnUrl = '/';
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http
      .post<{ jwt: string; expiresAt: number; user: any }>(
        'http://localhost:3000/api/login',
        {
          email,
          password,
        }
      )
      .pipe(
        tap((response) => {
          localStorage.setItem('authToken', response.jwt); // Lưu JWT vào localStorage
          localStorage.setItem('expiresAt', response.expiresAt.toString()); // Lưu thời gian hết hạn
        }),
        catchError(errorHandler)
      );
  }

  logout() {
    localStorage.removeItem('authToken'); // Xóa JWT khỏi localStorage
    localStorage.removeItem('expiresAt'); // Xóa thời gian hết hạn
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    const token = localStorage.getItem('authToken');
    const expiresAt = localStorage.getItem('expiresAt');

    if (!token || !expiresAt) {
      return false; // Nếu không có token hoặc thời gian hết hạn, coi như đã đăng xuất
    }

    // Kiểm tra nếu thời gian hiện tại đã vượt quá thời gian hết hạn
    const now = Date.now();
    return now < Number(expiresAt);
  }

  getRole() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT để lấy payload
    return payload.role; // Lấy role từ JWT
  }
}
