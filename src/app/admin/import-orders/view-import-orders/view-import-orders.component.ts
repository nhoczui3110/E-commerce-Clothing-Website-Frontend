import { Component, OnInit } from '@angular/core';
import { ImportOrderService } from '../../../shared/service/importOrder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../shared/service/product.service';
import { filter } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-import-orders',
  templateUrl: './view-import-orders.component.html',
  styleUrl: './view-import-orders.component.css',
})
export class ViewImportOrdersComponent implements OnInit {
  isCreateNewOrder = false;
  isFetching = false;
  importOrders: [];
  pagination: { currentPage: number; totalPages: number };
  order: string = null;
  sortBy: string = null;
  currentPage: number = 1;
  products = [];
  colors = [];
  chosenColor = null;
  sizes = [];
  addOrderItemForm: FormGroup;
  orderItems = [];
  isSuccess = false;
  isFail = false;
  message = '';
  delay = 3;
  fromDate = null;
  toDate = null;
  status = null;
  constructor(
    private importOrderService: ImportOrderService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}
  getOrders() {
    this.isFetching = true;
    this.importOrderService.getImportOrders(1, {}).subscribe((res) => {
      this.isFetching = false;
      this.pagination = {
        currentPage: res['currentPage'],
        totalPages: res['totalPages'],
      };
      this.importOrders = res['importOrders'];
    });
  }
  ngOnInit(): void {
    this.addOrderItemForm = this.fb.group({
      product: ['', Validators.required],
      color: ['', Validators.required],
      size: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(1)]],
      imageUrl: [''],
    });
    this.getOrders();
    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 1;
      this.order = params['order'] || null;
      this.sortBy = params['sortBy'] || null;
      this.isFetching = true;
      this.importOrderService
        .getImportOrders(this.currentPage, {
          order: this.order,
          sortBy: this.sortBy,
          fromDate: this.fromDate,
          toDate: this.toDate,
          status: this.status,
        })
        .subscribe((res) => {
          this.pagination = {
            currentPage: res['currentPage'],
            totalPages: res['totalPages'],
          };
          this.importOrders = res['importOrders'];
          this.isFetching = false;
        });
    });
  }

  changeFromDate(date) {
    this.fromDate = date;
    this.onHandleFilter();
  }

  changeToDate(date) {
    this.toDate = date;
    this.onHandleFilter();
  }
  onChangeStatus(status) {
    this.status = status;
    this.onHandleFilter();
  }
  onAddOrderItem() {
    console.log(this.addOrderItemForm.value);
    this.addOrderItemForm.patchValue({ imageUrl: this.chosenColor.imageUrl });
    const newItem = this.addOrderItemForm.value;

    // Kiểm tra xem item có cùng product và size không
    const existingItem = this.orderItems.find(
      (item) =>
        item.product === newItem.product &&
        item.size === newItem.size &&
        item.color === newItem.color
    );

    if (existingItem) {
      // Nếu đã tồn tại, cộng dồn số lượng
      existingItem.quantity += newItem.quantity;
      existingItem.price = newItem.price;
    } else {
      // Nếu không, thêm mục mới vào orderItems
      this.orderItems.push(newItem);
    }

    // Xóa dữ liệu từ form sau khi thêm
  }

  onHandleFilter() {
    let queryParams: any = {};
    if (this.order && this.sortBy) {
      queryParams.order = this.order;
      queryParams.sortBy = this.sortBy;
    }

    if (this.fromDate || this.fromDate === '') {
      queryParams.fromDate = this.fromDate;
    }
    if (this.toDate || this.toDate === '') {
      queryParams.toDate = this.toDate;
    }
    if (this.status || this.status === '') {
      queryParams.status = this.status;
    }
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

  onClickCreateOrder() {
    this.isCreateNewOrder = true;
    this.productService.getProductsAll().subscribe((res) => {
      this.products = res['products'];
    });
  }

  onCancelCreateOrder() {
    this.isCreateNewOrder = false;
  }

  onChangeProduct(idProduct, selectColor) {
    this.chosenColor = null;
    this.colors = this.products
      .filter((product) => {
        return product._id === idProduct;
      })
      .map((filterProduct) => filterProduct.variants);
    this.colors = this.colors[0];
    this.addOrderItemForm.patchValue({ color: '' });
  }
  onChangeColor(colorName) {
    this.sizes = this.colors
      .filter((color) => color.colorName === colorName)
      .map((filterColor) => {
        this.chosenColor = filterColor;
        return filterColor.size;
      });
    this.sizes = this.sizes[0];
  }

  findProductNameById(id) {
    return this.products.filter((product) => product._id === id)[0].name;
  }
  onDeleteOrderItem(productId, size, color) {
    this.orderItems = this.orderItems.filter(
      (item) =>
        !(
          item.product === productId &&
          item.size === size &&
          item.color === color
        )
    );
  }
  getTotalPrice(): number {
    return this.orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  onSaveImportOrders() {
    this.isFail = false;
    this.isSuccess = false;
    if (this.orderItems.length < 1) return;
    this.importOrderService
      .createImportOrders(this.orderItems, this.getTotalPrice())
      .subscribe({
        error: (err) => {
          this.isFail = true;
          this.message = err;
          setTimeout(() => {
            this.isFail = false;
          }, this.delay * 1000);
        },
        next: (value) => {
          this.isSuccess = true;
          this.message = 'Lưu đơn nhập thành công!';
          this.getOrders();
          setTimeout(() => {
            this.isSuccess = false;
          }, this.delay * 1000);
        },
      });
  }
}
