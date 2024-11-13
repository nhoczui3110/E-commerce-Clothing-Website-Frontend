import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, last } from 'rxjs';
import { errorHandler } from '../error-handler';
import { Address } from '../address.model';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class UserService {
  apiUrl = 'http://localhost:3000/api/users';
  constructor(private http: HttpClient) {}
  registerUser({
    firstName,
    lastName,
    email,
    password,
    phone,
    birthday,
    gender,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    birthday: string;
    gender: number;
  }) {
    return this.http
      .post(this.apiUrl + '/' + 'register', {
        firstName,
        lastName,
        email,
        password,
        phone,
        birthday,
        gender,
      })
      .pipe(catchError(errorHandler));
  }
  getAddress() {
    return this.http
      .get<Address[]>(this.apiUrl + '/address')
      .pipe(catchError(errorHandler));
  }
  getProfileUser() {
    return this.http
      .get(this.apiUrl + '/' + 'profile')
      .pipe(catchError(errorHandler));
  }
  updateProfileUser(formData: FormData) {
    return this.http
      .put(this.apiUrl + '/' + 'profile', formData)
      .pipe(catchError(errorHandler));
  }
  getUserOrders() {
    return this.http
      .get(this.apiUrl + '/' + 'orders')
      .pipe(catchError(errorHandler));
  }
  addNewAddress(address: Address) {
    return this.http
      .post(this.apiUrl + '/new-address', address)
      .pipe(catchError(errorHandler));
  }
  setDefaultAddress(addressId) {
    return this.http
      .patch(this.apiUrl + '/address/set-default/' + addressId, {})
      .pipe(catchError(errorHandler));
  }
  deleteAddress(addressId) {
    return this.http
      .delete(this.apiUrl + '/address/' + addressId)
      .pipe(catchError(errorHandler));
  }
  updateAddress(addressId, data: Address) {
    return this.http.patch(this.apiUrl + '/address/' + addressId, data);
  }
  getRatings(data: { isRated?: boolean }) {
    let params = new HttpParams();
    if (data.isRated) {
      params = params.append('isRated', true);
    }
    return this.http
      .get(this.apiUrl + '/get-ratings', { params })
      .pipe(catchError(errorHandler));
  }
  ratingProduct(productId, rating: number, comment: string) {
    if (!productId || !rating) return;
    return this.http
      .post(this.apiUrl + '/rating-product/' + productId, { rating, comment })
      .pipe(catchError(errorHandler));
  }
  requestChangePassword(oldPassword: string) {
    return this.http
      .post(this.apiUrl + '/request-change-password', {
        oldPassword,
      })
      .pipe(catchError(errorHandler));
  }
  confirmChangePassword(otp: string, newPassword: string) {
    return this.http
      .post(this.apiUrl + '/confirm-change-password', {
        otp,
        newPassword,
      })
      .pipe(catchError(errorHandler));
  }
}
