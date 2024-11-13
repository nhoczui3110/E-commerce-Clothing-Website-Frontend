import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { errorHandler } from '../error-handler';
import { catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) {}
  apiUrl = 'http://localhost:3000/api';
  createPaymentUrl(amount, bankCode, orderId) {
    if (!amount) return;
    return this.http
      .post(this.apiUrl + '/' + 'create_vnpay_url', {
        amount,
        orderId,
        bankCode,
      })
      .pipe(catchError(errorHandler));
  }
}
