import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { errorHandler } from '../error-handler';
export interface SliderItem {
  imageUrl: string;
  title: string;
  description: string;
  slug: string;
}

export interface Slider {
  list: SliderItem[];
  interval: number; // khoảng thời gian chuyển đổi (ms)
}

// Định nghĩa kiểu dữ liệu cho priceFilter
export interface PriceFilterItem {
  min?: number;
  max?: number;
}

export type PriceFilter = PriceFilterItem[];
@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private apiUrl = 'http://localhost:3000/api/configurations';
  constructor(private http: HttpClient) {}
  getSlider(): Observable<Slider> {
    return this.http
      .get<Slider>(`${this.apiUrl}/get-slider`)
      .pipe(catchError(errorHandler));
  }

  // Lấy priceFilter
  getPriceFilter(): Observable<PriceFilter> {
    return this.http
      .get<PriceFilter>(`${this.apiUrl}/get-price-filter`)
      .pipe(catchError(errorHandler));
  }

  // Cập nhật slider
  putSlider(slider: FormData): Observable<Slider> {
    return this.http
      .put<Slider>(`${this.apiUrl}/update-slider`, slider)
      .pipe(catchError(errorHandler));
  }

  // Cập nhật priceFilter
  putPriceFilter(priceFilter: PriceFilter): Observable<PriceFilter> {
    return this.http
      .put<PriceFilter>(`${this.apiUrl}/update-price-filter`, {
        priceFilter,
      })
      .pipe(catchError(errorHandler));
  }
}
