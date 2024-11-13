import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { errorHandler } from '../error-handler';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrl = 'http://localhost:3000/api/category';
  constructor(private http: HttpClient) {}
  getCategories() {
    return this.http.get(this.apiUrl);
  }

  createCategory(data: FormData) {
    return this.http.post(this.apiUrl, data).pipe(catchError(errorHandler));
  }

  updateCategory(data: FormData, slug: string) {
    return this.http
      .put(this.apiUrl + '/' + slug, data)
      .pipe(catchError(errorHandler));
  }

  deleteCategory(slug: string) {
    return this.http
      .delete(this.apiUrl + '/' + slug)
      .pipe(catchError(errorHandler));
  }

  getCategory(slug: string) {
    return this.http
      .get(this.apiUrl + '/' + slug)
      .pipe(catchError(errorHandler));
  }
}
