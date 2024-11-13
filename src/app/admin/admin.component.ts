import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  listFeature: { featureName: string; featureUrl: string }[] = [];
  constructor(private router: Router) {}

  ngOnInit(): void {
    let url = this.router.url;
    if (url.startsWith('/admin/products')) {
      this.onChangeFeature('product');
    } else if (url.startsWith('/admin/orders')) {
      this.onChangeFeature('order');
    } else if (url.startsWith('/admin/configuration')) {
      this.onChangeFeature('configuration');
    } else if (url.startsWith('/admin/category')) {
      this.onChangeFeature('category');
    } else if (url.startsWith('/admin/import-orders')) {
      this.onChangeFeature('import-order');
    }
  }

  onChangeFeature(featureName: string) {
    if (featureName === 'product') {
      this.listFeature = [
        { featureName: 'Xem sản phẩm', featureUrl: 'products/view-products' },
        { featureName: 'Thêm sản phẩm', featureUrl: 'products/add-product' },
      ];
    } else if (featureName === 'category') {
      this.listFeature = [
        { featureName: 'Xem category', featureUrl: 'category/view-category' },
        { featureName: 'Thêm category', featureUrl: 'category/add-category' },
      ];
    } else if (featureName === 'order') {
      this.listFeature = [
        { featureName: 'Xem đơn hàng', featureUrl: 'orders/view-orders' },
      ];
    } else if (featureName === 'configuration') {
      this.listFeature = [
        {
          featureName: 'Thay đổi Hero Slider',
          featureUrl: 'configuration/change-hero-slider',
        },
        {
          featureName: 'Thay đổi Price Filter',
          featureUrl: 'configuration/change-price-filter',
        },
      ];
    } else if (featureName === 'import-order') {
      this.listFeature = [
        {
          featureName: 'Xem đơn nhập hàng',
          featureUrl: 'import-orders/view-import-orders',
        },
      ];
    }
  }
}
