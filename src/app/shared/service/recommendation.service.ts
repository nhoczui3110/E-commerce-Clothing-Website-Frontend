import { HttpClient } from '@angular/common/http';
import { Product } from '../product.model';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { errorHandler } from '../error-handler';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class RecommendationService {
  apiUrl = 'http://localhost:3000/api/recommendations';
  constructor(private http: HttpClient) {}
  getRecommendation() {
    return this.http
      .get<Product[]>(this.apiUrl + '/get-recommendations')
      .pipe(catchError(errorHandler));
  }
  getSimilarProducts(productId) {
    return this.http
      .get<Product[]>(this.apiUrl + '/get-similar-products/' + productId)
      .pipe(catchError(errorHandler));
  }
}
