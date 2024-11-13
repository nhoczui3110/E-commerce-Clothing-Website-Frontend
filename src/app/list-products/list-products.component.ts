import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/service/product.service';
import { Product } from '../shared/product.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CategoryService } from '../shared/service/category.service';
import {
  ConfigurationService,
  PriceFilter,
} from '../shared/service/configuration.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.css',
})
export class ListProductsComponent implements OnInit {
  // Lưu danh sách các HTMLElement
  infinitiveNumber = 10000000000000;
  pagination: { currentPage: number; totalPages: number };
  priceList: HTMLElement[] = [];
  categoryList: HTMLElement[] = [];
  categories: [];
  priceFilter: any[] = [];
  products: Product[];
  isFetching = false;
  currentPage = 1;
  sortBy: string;
  order: string;
  priceRanges: PriceFilter = [];
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private configurationService: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.configurationService.getPriceFilter().subscribe((res) => {
      this.priceRanges = res;
    });
    this.categoryService.getCategories().subscribe((result) => {
      this.categories = result['categories'];
    });
    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 1;
      let category = params['category'];
      let minPrice =
        +params['minPrice'] === 0 ? undefined : +params['minPrice'];
      let maxPrice = +params['maxPrice'];
      let sortBy = params['sortBy'];
      let order = params['order'];
      this.configurationService.getPriceFilter();
      this.productService
        .getProducts(this.currentPage, {
          category,
          minPrice,
          maxPrice,
          sortBy,
          order,
        })
        .subscribe({
          next: (result) => {
            this.products = result['products'];
            this.pagination = {
              currentPage: result['currentPage'],
              totalPages: result['totalPages'],
            };
            this.isFetching = false;
          },
          error: (error) => {
            console.error('Error fetching products:', error);
            this.isFetching = false;
          },
        });
    });
  }

  onFilterProduct() {
    let minPrice: any;
    let maxPrice: any;
    if (this.priceFilter.length > 0) {
      maxPrice = Math.max(...this.priceFilter);
      minPrice = Math.min(...this.priceFilter);
    }

    const categories = this.categoryList
      .map((item) => {
        return item.getAttribute('data-category');
      })
      .join(',');

    const queryParams: any = {};

    if (categories.length > 0) {
      queryParams.category = categories;
    }

    if (this.priceFilter.length > 0) {
      queryParams.minPrice = minPrice;
      queryParams.maxPrice = maxPrice;
    }

    if (this.sortBy && this.order) {
      queryParams.sortBy = this.sortBy;
      queryParams.order = this.order;
    }

    this.router.navigate(['./'], { queryParams, relativeTo: this.route });
  }

  addTag(event, type: string): void {
    if (event.target.checked) {
      if (type === 'price') {
        if (!this.priceList.includes(event.target.nextElementSibling)) {
          let temp: any[] = event.target.nextElementSibling
            .getAttribute('data-price')
            .split(',')
            .map((item) => +item);
          this.priceFilter = this.priceFilter.concat(...temp);
          this.priceList.push(event.target.nextElementSibling);
        }
      } else {
        if (!this.categoryList.includes(event.target.nextElementSibling)) {
          this.categoryList.push(event.target.nextElementSibling);
        }
      }
      this.onFilterProduct();
    } else {
      this.removeTag(event.target.nextElementSibling, type);
    }
  }

  // Xóa tag khỏi danh sách
  removeTag(tagElement: HTMLElement, type: string): void {
    let index: number;
    if (type === 'price') index = this.priceList.indexOf(tagElement);
    else index = this.categoryList.indexOf(tagElement);
    if (index > -1) {
      if (type === 'price') {
        let temp: any[] = tagElement
          .getAttribute('data-price')
          .split(',')
          .map((item) => +item);
        for (let i = 0; i < temp.length; i++) {
          for (let j = 0; j < this.priceFilter.length; j++) {
            if (temp[i] === this.priceFilter[j]) {
              this.priceFilter.splice(j, 1);
              break;
            }
          }
        }
        this.priceList.splice(index, 1);
      } else {
        this.categoryList.splice(index, 1);
      }
      const checkboxId = tagElement.getAttribute('for');
      const checkbox = document.getElementById(checkboxId!) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = false; // Bỏ check cho checkbox
      }
      this.onFilterProduct();
    }
  }

  onChangeSort(sortType: string) {
    if (sortType === 'sort-by-name-order-asc') {
      this.sortBy = 'name';
      this.order = 'asc';
    } else if (sortType === 'sort-by-name-order-desc') {
      this.sortBy = 'name';
      this.order = 'desc';
    } else if (sortType === 'sort-by-price-order-asc') {
      this.sortBy = 'price';
      this.order = 'asc';
    } else if (sortType === 'sort-by-price-order-desc') {
      this.sortBy = 'price';
      this.order = 'desc';
    }
    this.onFilterProduct();
  }
}
