import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs';
import { errorHandler } from '../error-handler';

@Injectable({
  providedIn: 'root',
})
export class ShipService {
  apiUrl = 'http://sandbox.goship.io/api/v2';

  constructor(private http: HttpClient) {}
  getCities() {
    return this.http.get(this.apiUrl + '/' + 'cities');
  }
  getDistrictsByCity(cityId) {
    return this.http.get(this.apiUrl + '/cities/' + cityId + '/districts');
  }
  getWardsByDistrict(districtId) {
    return this.http.get(this.apiUrl + '/districts/' + districtId + '/wards');
  }
  getRate({
    cityId,
    districtId,
    cod,
    amount,
  }: {
    cityId: string;
    districtId: string;
    cod?: number;
    amount: number;
  }) {
    return this.http
      .post(this.apiUrl + '/rates', {
        shipment: {
          address_from: {
            district: environment.districtFrom,
            city: environment.cityFrom,
          },
          address_to: {
            district: districtId,
            city: cityId,
          },
          parcel: {
            cod: cod || 0,
            amount: amount,
            width: environment.width,
            height: environment.height,
            length: environment.length,
            weight: environment.weight,
          },
        },
      })
      .pipe(
        map((res: any) => res['data']), // Trả về dữ liệu từ phản hồi
        catchError(errorHandler)
      );
  }
}
