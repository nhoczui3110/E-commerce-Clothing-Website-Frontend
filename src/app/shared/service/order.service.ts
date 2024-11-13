import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs';
import { errorHandler } from '../error-handler';
import { Injectable } from '@angular/core';
import { Address } from '../address.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  apiUrl = 'http://localhost:3000/api/orders';
  constructor(private http: HttpClient) {}

  createOrder(paymentMethod, shippingFee: number, shippingAddress: Address) {
    return this.http
      .post(this.apiUrl, { paymentMethod, shippingFee, shippingAddress })
      .pipe(catchError(errorHandler));
  }
  getOrderById(orderId: string) {
    return this.http
      .get(this.apiUrl + '/' + orderId)
      .pipe(catchError(errorHandler));
  }
  getUserOrders(status: string) {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http
      .get(this.apiUrl, { params })
      .pipe(catchError(errorHandler));
  }

  getOrders(
    page: number,
    {
      status,
      fromDate,
      toDate,
      sortBy,
      order,
    }: {
      status?: string;
      fromDate?: string;
      toDate?: string;
      sortBy?: string;
      order?: string;
    }
  ) {
    let params = new HttpParams();
    if (page) {
      console.log('==', page);
      params = params.append('page', page);
    }
    if (status) {
      params = params.append('status', status);
    }
    if (fromDate) {
      params = params.append('fromDate', fromDate);
    }
    if (toDate) {
      params = params.append('toDate', toDate);
    }
    if (sortBy && order) {
      params = params.append('sortBy', sortBy);
      params = params.append('order', order);
    }

    return this.http
      .get(this.apiUrl + '-admin', { params })
      .pipe(catchError(errorHandler));
  }

  updateStatus(status, orderId) {
    return this.http
      .put(this.apiUrl + '/' + orderId, { status })
      .pipe(catchError(errorHandler));
  }
}
