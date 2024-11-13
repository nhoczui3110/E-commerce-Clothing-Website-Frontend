import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { errorHandler } from '../error-handler';

@Injectable({ providedIn: 'root' })
export class CartService {
  apiUrl = 'http://localhost:3000/api/cart';
  constructor(private http: HttpClient) {}

  getCart(quantity?: number) {
    let params = new HttpParams();
    if (quantity) {
      params = params.append('quantity', quantity);
    }
    return this.http
      .get(this.apiUrl, { params: params })
      .pipe(catchError(errorHandler));
  }

  addToCart({
    productId,
    quantity,
    size,
    color,
  }: {
    productId: string;
    quantity: number;
    size: string;
    color: string;
  }) {
    return this.http
      .post(this.apiUrl, { productId, quantity, size, color })
      .pipe(catchError(errorHandler));
  }

  updateCart({
    cartItemId,
    quantity,
  }: {
    cartItemId: string;
    quantity: number;
  }) {
    return this.http
      .put(this.apiUrl + '/' + cartItemId, { quantity })
      .pipe(catchError(errorHandler));
  }

  removeFromCart(cartItemId) {
    return this.http
      .delete(this.apiUrl + '/' + cartItemId)
      .pipe(catchError(errorHandler));
  }
}
