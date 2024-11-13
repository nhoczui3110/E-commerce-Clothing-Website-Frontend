import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken'); // Lấy JWT token từ localStorage
    if (req.url.startsWith('http://sandbox.goship.io/api/v2')) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${environment.accessTokenGoShip}`,
        },
      });
      return next.handle(authReq);
    }
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    // Nếu có token, thêm vào header Authorization
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });

      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          // Kiểm tra nếu lỗi là 401 Unauthorized
          if (error.status === 401) {
            // Điều hướng người dùng về trang đăng nhập
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
      );
    }

    // Nếu không có token, gửi request như bình thường
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Xử lý lỗi nếu không có token
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
