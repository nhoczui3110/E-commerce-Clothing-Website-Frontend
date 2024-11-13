import { Component, OnInit } from '@angular/core';
import { ImportOrderService } from '../../../shared/service/importOrder.service';
import { ProductService } from '../../../shared/service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-import-orders-detail',
  templateUrl: './import-orders-detail.component.html',
  styleUrl: './import-orders-detail.component.css',
})
export class ImportOrdersDetailComponent implements OnInit {
  products = [];
  colors = [];
  chosenColor = null;
  sizes = [];
  addOrderItemForm: FormGroup;
  orderItems: any = [];
  idImportOrder;
  status;
  isSuccess = false;
  isFail = false;
  message = '';
  delay = 3;
  constructor(
    private importOrderService: ImportOrderService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idImportOrder = params.get('id');
      this.importOrderService
        .getImportOrderById(this.idImportOrder)
        .subscribe((res) => {
          this.status = res['status'];
          this.orderItems = res['orderItems'];
        });
    });
    this.addOrderItemForm = this.fb.group({
      product: ['', Validators.required],
      color: ['', Validators.required],
      size: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(1)]],
      imageUrl: [''],
    });
    this.productService.getProductsAll().subscribe((res) => {
      this.products = res['products'];
    });
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
    return this.products.filter((product) => product._id === id)[0]?.name;
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
      .updateImportOrder(this.idImportOrder, {
        orderItems: this.orderItems,
        totalCost: this.getTotalPrice(),
      })
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
          this.message = 'Save đơn nhập thành công!';
          setTimeout(() => {
            this.isSuccess = false;
          }, this.delay * 1000);
        },
      });
  }
  onAddOrderItem() {
    this.addOrderItemForm.patchValue({ imageUrl: this.chosenColor.imageUrl });
    const newItem = this.addOrderItemForm.value;
    // Kiểm tra xem item có cùng product và size không
    const existingItem = this.orderItems.find((item) => {
      console.log(item.color, newItem.color);
      return (
        item.product === newItem.product &&
        item.size === newItem.size &&
        item.color === newItem.color
      );
    });
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

  onChangeStatus(status) {
    this.isFail = false;
    this.isSuccess = false;
    this.importOrderService
      .updateImportOrder(this.idImportOrder, { status })
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
          this.message = 'Thay đổi trạng thái đơn hàng thành ' + status;
          setTimeout(() => {
            this.isSuccess = false;
          }, this.delay * 1000);
        },
      });
  }
}
