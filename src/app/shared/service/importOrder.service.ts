import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { errorHandler } from '../error-handler';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class ImportOrderService {
  apiUrl = 'http://localhost:3000/api/import-orders';
  constructor(private http: HttpClient) {}
  getImportOrders(
    page: number,
    {
      sortBy,
      order,
      fromDate,
      toDate,
      status,
    }: {
      fromDate?: any;
      toDate?: any;
      sortBy?: string;
      order?: string;
      status?: string;
    }
  ) {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page.toString());
    }

    // Thêm tham số sortBy và order nếu có
    if (sortBy && order) {
      params = params.append('sortBy', sortBy);
      params = params.append('order', order);
    }
    if (fromDate) {
      params = params.append('fromDate', fromDate);
    }
    if (toDate) {
      params = params.append('toDate', toDate);
    }
    if (status) {
      params = params.append('status', status);
    }
    return this.http
      .get(this.apiUrl, { params })
      .pipe(catchError(errorHandler));
  }

  createImportOrders(orderItems, totalCost) {
    return this.http
      .post(this.apiUrl, { orderItems, totalCost })
      .pipe(catchError(errorHandler));
  }

  getImportOrderById(id) {
    return this.http.get(this.apiUrl + '/' + id).pipe(catchError(errorHandler));
  }

  updateImportOrder(
    id,
    {
      status,
      orderItems,
      totalCost,
    }: { status?: string; orderItems?: []; totalCost?: number }
  ) {
    let updateData: any = {};

    if (status) {
      updateData.status = status;
    }
    if (orderItems) {
      updateData.orderItems = orderItems;
    }
    if (totalCost) {
      updateData.totalCost = totalCost;
    }

    return this.http
      .patch(this.apiUrl + '/' + id, updateData)
      .pipe(catchError(errorHandler));
  }
}
