import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../product.model';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { error } from 'console';
import { errorHandler } from '../error-handler';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class ProductService {
  paginationChanged = new Subject<any>();
  constructor(private http: HttpClient) {}
  apiUrl = 'http://localhost:3000/api/products'; // Base API URL
  createProduct(product) {
    return this.http
      .post<Product>(this.apiUrl, product)
      .pipe(catchError(errorHandler));
  }
  updateProduct(product, slug) {
    return this.http
      .put(this.apiUrl + '/' + slug, product)
      .pipe(catchError(errorHandler));
  }

  getProducts(
    page: number,
    {
      minPrice,
      maxPrice,
      category,
      sortBy,
      order,
      search,
    }: {
      minPrice?: number;
      maxPrice?: number;
      category?: string;
      sortBy?: string;
      order?: string;
      search?: string;
    }
  ) {
    let params = new HttpParams().set('page', page.toString());
    console.log(minPrice);
    if (minPrice !== undefined && !Number.isNaN(minPrice)) {
      params = params.set('minPrice', minPrice.toString());
    }

    if (maxPrice !== undefined && !Number.isNaN(minPrice)) {
      params = params.set('maxPrice', maxPrice.toString());
    }

    if (category) {
      params = params.set('category', category);
    }

    if (sortBy && order) {
      params = params.set('sortBy', sortBy);
      params = params.set('order', order);
    }
    if (search === '' || search) {
      params = params.set('search', search);
    }
    console.log(search);
    return this.http.get(this.apiUrl, { params }).pipe(
      map((res) => {
        res['products'] = res['products'].map((data) => {
          const variants = data.variants.map((variant) => {
            const size = variant.size.map((item) => ({
              sizeName: item.sizeName,
              stock: item.stock,
            }));

            return {
              colorName: variant.colorName,
              size: size,
              imageUrl: variant.imageUrl,
            };
          });
          let product = new Product(
            data.name,
            data.slug,
            data.description,
            { name: data.category.name, slug: data.category.slug }, // Assuming category structure
            data.price,
            variants
          );
          product.averageRating = data.averageRating;
          return product;
        });

        // Extract pagination data
        let pagination = {
          currentPage: res['currentPage'],
          totalPages: res['totalPages'],
        };

        // Emit the updated pagination
        this.paginationChanged.next(pagination);
        return res;
      }),
      catchError(errorHandler)
    );
  }
  getProductsDemo(orderBy: 'views' | 'averageRating' | 'createdAt') {
    const params = new HttpParams().set('orderBy', orderBy);
    return this.http.get(this.apiUrl + '/demo', {
      params,
    });
  }
  getProductDetail(slug: string): Observable<Product> {
    return this.http.get(`${this.apiUrl}/${slug}`).pipe(
      map((data) => {
        const product: Product = data['product'];
        return product;
      }),
      catchError(errorHandler)
    );
  }
  searchOnProducts(keyword: string) {
    let params = new HttpParams();
    params = params.append('keyword', keyword);
    return this.http
      .get(this.apiUrl + '/search', { params })
      .pipe(catchError(errorHandler));
  }
  deleteProduct(slug: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${slug}`)
      .pipe(catchError(errorHandler));
  }

  getProductsAll() {
    return this.http.get(this.apiUrl + '-all').pipe(catchError(errorHandler));
  }
}
