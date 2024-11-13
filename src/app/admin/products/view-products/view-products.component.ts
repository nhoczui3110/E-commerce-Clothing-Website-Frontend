import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/service/product.service';
import { Product } from '../../../shared/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { CategoryService } from '../../../shared/service/category.service';
import {} from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faEye } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css',
})
export class ViewProductsComponent implements OnInit, OnDestroy {
  products: Product[];
  pagination: { currentPage: number; totalPages: number };
  slugToDelete: string = null;
  title: string = null;
  msg: string = null;
  idTimeOut = null;
  delay: number = 4;
  stateDeleteProduct: string = null;
  showConfirmDeleteBox = false;
  isFetching: boolean = false;
  subPagination: Subscription = null;
  currentPage: number = null;
  sortBy: string = null;
  order: string = null;
  categories: any = [];
  categorySlug: string;
  searchValue: string = null;
  faTrash = faTrash;
  faEdit = faEdit;
  faEye = faEye;
  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {}
  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((result: any) => {
      this.categories = result.categories;
      console.log(this.categories);
    });
    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 1;
      this.categorySlug = params['category'] || null;
      this.order = params['order'] || null;
      this.sortBy = params['sortBy'] || null;
      this.searchValue = params['search'] || null;
      this.productService
        .getProducts(this.currentPage, {
          order: this.order,
          sortBy: this.sortBy,
          category: this.categorySlug,
          search: this.searchValue,
        })
        .subscribe({
          next: (result) => {
            console.log(result);
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
    this.isFetching = true;
  }
  onViewDetail(slug: string) {
    this.router.navigate(['./', slug]);
  }

  handleDeleteProduct(result: boolean) {
    this.showConfirmDeleteBox = false;
    if (result) {
      this.isFetching = true;
      this.productService.deleteProduct(this.slugToDelete).subscribe({
        complete: () => {
          this.stateDeleteProduct = 'success';
          this.msg = 'Xóa sản phẩm thành công!';
          this.title = 'Success';
          this.idTimeOut = setTimeout(() => {
            this.stateDeleteProduct = null;
          }, this.delay * 1000);
          this.productService
            .getProducts(this.currentPage, {})
            .subscribe((result) => {
              this.products = result['products'];
            });
          this.isFetching = false;
        },
        error: (err) => {
          this.stateDeleteProduct = 'error';
          this.msg = err;
          this.title = 'Error';
          this.idTimeOut = setTimeout(() => {
            this.stateDeleteProduct = null;
          }, this.delay * 1000);
          this.isFetching = false;
        },
      });
    }
  }

  onDeleteProduct(slug: string) {
    this.slugToDelete = slug;
    this.showConfirmDeleteBox = true;
  }

  onHandleFilter() {
    let queryParams: any = {};
    if (this.order && this.sortBy) {
      queryParams.order = this.order;
      queryParams.sortBy = this.sortBy;
    }
    queryParams.category = this.categorySlug || '';
    queryParams.search = this.searchValue;
    this.router.navigate(['./'], {
      queryParams,
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
  }
  onFilterChange(e: any) {
    [this.sortBy, this.order] = e.target.value.split('-');
    this.onHandleFilter();
  }
  onCategoryChange(e: any) {
    if (e.target.value) {
      this.categorySlug = e.target.value;
    } else {
      this.categorySlug = null;
    }
    this.onHandleFilter();
  }
  onSearch(value: string) {
    this.searchValue = value;
    this.onHandleFilter();
  }

  ngOnDestroy(): void {}
}
