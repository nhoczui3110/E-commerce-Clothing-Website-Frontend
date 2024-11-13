import { Component, OnInit } from '@angular/core';
import { CartService } from '../shared/service/cart.service';
import { CartItem } from '../shared/cart.model';
import { faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { OrderService } from '../shared/service/order.service';
import { Address } from '../shared/address.model';
import { UserService } from '../shared/service/user.service';
import { ShipService } from '../shared/service/ship.service';
import { forkJoin } from 'rxjs';
import { PaymentService } from '../shared/service/payment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  faTrash = faTrash;
  cart: CartItem[];
  isFetching = false;
  isFail = false;
  isSuccess = false;
  delay = 3;
  message = '';
  isSubmit = false;
  chosenPaymentMethod = 'VNPAY';
  address: Address[];
  chosenAddress: Address;
  isConfigureAddress = false;
  faCheckCircle = faCheckCircle;
  rate = null;
  shippingFee: number = 0;
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private userService: UserService,
    private shipService: ShipService,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) {}
  async ngOnInit(): Promise<void> {
    this.isFetching = true;
    this.route.queryParams.subscribe((params) => {
      if (params['success']) {
        this.isSubmit = true;
        this.isFetching = false;
      }
    });
    forkJoin({
      cart: this.cartService.getCart(),
      address: this.userService.getAddress(),
    }).subscribe({
      next: ({ cart, address }) => {
        this.cart = cart as CartItem[];
        console.log(this.cart);
        this.address = address['address'];
        console.log(address['address']);
        if (this.address.length === 0) {
          this.isFetching = false;
          return;
        }
        this.chosenAddress = this.address.find((add) => add.isDefault);

        // Gọi các hàm sau khi lấy xong cart và address
        this.getDefaultAddress();
        if (this.chosenAddress) {
          this.getRate(
            this.chosenAddress.city.id,
            this.chosenAddress.district.id,
            this.getTotalCart()
          );
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getRate(cityId, districtId, amount) {
    this.shipService
      .getRate({
        cityId: cityId,
        districtId: districtId,
        amount: amount,
      })
      .subscribe({
        next: (data) => {
          this.rate = data.reduce((prev, current) => {
            return prev.total_amount < current.total_amount ? prev : current;
          });
          this.isFetching = false;
        },
        error: (err) => {
          console.log(err); // Xử lý lỗi nếu có
        },
      });
  }
  async getDefaultAddress(): Promise<void> {
    return new Promise((resolve) => {
      this.userService.getAddress().subscribe((res) => {
        this.address = res['address'];
        this.chosenAddress = this.address.find((add) => add.isDefault);
        resolve();
      });
    });
  }
  onConfigureAddress() {
    this.isConfigureAddress = true;
  }
  async onDisableConfigureAddress() {
    this.isConfigureAddress = false;
    await this.getDefaultAddress();

    if (this.chosenAddress) {
      this.isFetching = true;
      this.getRate(
        this.chosenAddress.city.id,
        this.chosenAddress.district.id,
        this.getTotalCart()
      );
    }
  }
  getTotalCartItem(cartItem: CartItem) {
    return cartItem.product.price * cartItem.quantity;
  }
  getTotalCart() {
    return this.cart.reduce((total, cartItem: CartItem) => {
      return total + cartItem.product.price * cartItem.quantity;
    }, 0);
  }
  getImageUrl(cartItem: CartItem) {
    return cartItem.product.variants.find((variant) => {
      return variant.colorName.trim() === cartItem.color.trim();
    })?.imageUrl;
  }

  onIncreaseQuantity(cartItem: CartItem) {
    let foundCartItemIndex = this.cart.findIndex((item: CartItem) => {
      if (item._id === cartItem._id) {
        return true;
      }
      return false;
    });
    let stock;
    let variant = cartItem.product.variants.find(
      (variant) => variant.colorName.trim() === cartItem.color.trim()
    );
    if (variant) {
      let size = variant.size.find(
        (s) => s.sizeName.trim() === cartItem.size.trim()
      );
      if (size) {
        stock = size.stock;
      }
    }
    if (cartItem.quantity < stock) {
      cartItem.quantity += 1;
      this.cart[foundCartItemIndex] = cartItem;
      this.cartService
        .updateCart({ cartItemId: cartItem._id, quantity: cartItem.quantity })
        .subscribe((res) => {
          console.log(res);
        });
    }
  }

  onDecreaseQuantity(cartItem: CartItem) {
    let foundCartItemIndex = this.cart.findIndex((item: CartItem) => {
      if (item._id === cartItem._id) {
        return true;
      }
      return false;
    });
    let stock;
    let variant = cartItem.product.variants.find(
      (variant) => variant.colorName.trim() === cartItem.color.trim()
    );
    if (variant) {
      let size = variant.size.find(
        (s) => s.sizeName.trim() === cartItem.size.trim()
      );
      if (size) {
        stock = size.stock;
      }
    }
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      this.cart[foundCartItemIndex] = cartItem;
      this.cartService
        .updateCart({ cartItemId: cartItem._id, quantity: cartItem.quantity })
        .subscribe((res) => {
          console.log(res);
        });
    }
  }
  onChooseMethodPayment(method) {
    this.chosenPaymentMethod = method;
  }
  onRemoveFromCart(cartItem: CartItem) {
    this.isFail = false;
    this.isSuccess = false;
    this.cartService.removeFromCart(cartItem._id).subscribe({
      error: (err) => {
        this.isFail = true;
        this.message = err;
        setTimeout(() => {
          this.isFail = false;
        }, this.delay * 1000);
      },
      complete: () => {
        let cartItemIndex = this.cart.findIndex(
          (item: CartItem) => cartItem._id === item._id
        );
        this.cart.splice(cartItemIndex, 1);
        this.isSuccess = true;
        this.message = 'Xóa sản phẩm ra khỏi giỏ hàng thành công';
        setTimeout(() => {
          this.isSuccess = false;
        }, this.delay * 1000);
      },
    });
  }

  onHandleOrder() {
    this.isFail = false;
    if (!this.chosenPaymentMethod) return;
    this.orderService
      .createOrder(
        this.chosenPaymentMethod,
        this.rate['total_amount'],
        this.chosenAddress
      )
      .subscribe({
        error: (err) => {
          this.isFail = true;
          this.message = err;
          setTimeout(() => {
            this.isFail = false;
          }, this.delay * 1000);
        },
        next: (res) => {
          console.log(res);
          if (this.chosenPaymentMethod === 'VNPAY') {
            this.paymentService
              .createPaymentUrl(
                +res['totalCost'] + +res['shippingFee'],
                '',
                res['_id']
              )
              .subscribe((res) => {
                window.location.href = res['redirectUrl'];
              });
          } else {
            this.isSubmit = true;
            this.cart = [];
          }
        },
      });
  }
}
