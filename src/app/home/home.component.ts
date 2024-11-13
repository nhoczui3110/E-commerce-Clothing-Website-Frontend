import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/service/product.service';
import { CategoryService } from '../shared/service/category.service';
import { Product } from '../shared/product.model';
import { forkJoin } from 'rxjs';
import {
  ConfigurationService,
  Slider,
} from '../shared/service/configuration.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  isFetching = false;
  categories;
  views: Product[];
  createdAt: Product[];
  averageRating: Product[];
  slider: Slider;
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private configurationService: ConfigurationService
  ) {}
  ngOnInit(): void {
    this.isFetching = true;
    forkJoin({
      createdAt: this.productService.getProductsDemo('createdAt'),
      views: this.productService.getProductsDemo('views'),
      averageRating: this.productService.getProductsDemo('averageRating'),
      categories: this.categoryService.getCategories(),
      slider: this.configurationService.getSlider(),
    }).subscribe({
      next: (res) => {
        this.createdAt = res.createdAt as Product[];
        this.views = res.views as Product[];
        this.averageRating = res.averageRating as Product[];
        this.categories = res.categories['categories'];
        this.slider = res.slider;
        this.isFetching = false;
        console.log(this.slider);
      },
      error: (error) => {
        console.error('Có lỗi xảy ra:', error);
        this.isFetching = true;
      },
    });
  }
}
