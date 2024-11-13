import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../shared/service/order.service';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../../shared/order.model';
import { OrderItem } from '../../../../shared/order-item.model';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../shared/service/auth.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent implements OnInit {
  isShowConfirmBox = false;
  orderId: string;
  order: Order;
  isFetching = false;
  textButton = 'Xác nhận đơn hàng';
  nextStatus = 'Waiting';
  title = 'Xác nhận đơn hàng';
  msg = 'Bạn có muốn xác nhận đơn hàng?';
  delay = 3;
  type: 'success' | 'error';
  isFail = false;
  isSuccess = false;
  isCancel = false;
  cancelMessage = 'Bạn có chắc muốn cancel đơn hàng?';
  cancelTitle = 'Xác nhận cancel đơn hàng!';
  faCheckCircle = faCheckCircle;
  role;
  message = null;
  isShowStatusError = false;
  messageToast = null;
  titleToast = null;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.isFetching = true;
    this.route.paramMap.subscribe((params) => {
      this.orderId = params.get('id');

      this.getOrder();
    });
  }

  getImageUrl(orderItem: OrderItem) {
    return orderItem.product.variants.find((variant) => {
      return variant.colorName.trim() === orderItem.color.trim();
    })?.imageUrl;
  }

  confirmEvent(res: boolean) {
    this.isShowConfirmBox = false;
    console.log(this.isCancel);
    if (!res) {
      this.isCancel = false;
      return;
    }
    if (this.isCancel) {
      this.handleUpdateStatus('Cancelled');
      console.log('vao can cel');
    } else {
      this.handleUpdateStatus(this.nextStatus);
    }
  }

  updateNextStatus() {
    console.log(this.order.status);
    switch (this.order.status) {
      case 'Waiting':
        this.title = 'Xác nhận đơn hàng';
        this.msg =
          'Bạn có chắc muốn xác nhận đơn hàng? Sau khi xác nhận không thể hoàn tác!';
        this.textButton = 'Xác nhận đơn hàng';
        this.nextStatus = 'Pending';
        break;
      case 'Pending':
        this.title = 'Xác nhận đã đưa cho đơn vị vận chuyển';
        this.msg =
          'Bạn có chắc muốn xác nhận đã đưa cho đơn vị vận chuyển? Sau khi xác nhận không thể cancel đơn hàng';
        this.textButton = 'Xác nhận đã đưa cho đơn vị vận chuyển';
        this.nextStatus = 'Shipped';
        break;
      case 'Shipped':
        this.title = 'Xác nhận đơn hàng đã giao thành công';
        this.msg =
          'Bạn có chắc muốn xác nhận đã giao hàng thành công? Sau khi xác nhận không thể hoàn tác';
        this.textButton = 'Xác nhận đã giao hàng thành công';
        this.nextStatus = 'Delivered';
        break;
      case 'Cancelled': {
        this.title = 'Khôi phục đơn hàng thành pending';
        this.msg = 'Xác nhận khôi phục đơn hàng sang trạng thái pending';
        this.textButton = 'Khôi phục trạng thái pending';
        this.nextStatus = 'Pending';
      }
    }
  }

  getOrder() {
    this.orderService.getOrderById(this.orderId).subscribe({
      error: (err) => {
        this.isFetching = false;
        this.message = err;
        this.title = 'Lỗi tìm kiếm đơn hàng!';
        this.isShowStatusError = true;
      },
      next: (res: Order) => {
        this.order = res;
        this.isFetching = false;
        this.updateNextStatus();
        console.log(this.order);
      },
    });
  }

  onShowConfirmBox() {
    this.isShowConfirmBox = true;
  }

  handleUpdateStatus(status) {
    this.orderService.updateStatus(status, this.orderId).subscribe({
      next: (res) => {
        this.order.status = res['order'].status;
        if (this.order.status === 'Delivered') {
          this.order.isPaid = true;
        }
        if (this.order.status === 'Cancelled') this.isCancel = false;
        this.updateNextStatus();
        this.showToast(res['message'], 'Thành công', 'success');
      },
      error: (err) => {
        this.showToast(err, 'Error', 'error');
      },
    });
  }

  showToast(message: string, title: string, type: 'success' | 'error') {
    this.messageToast = message;

    this.titleToast = title;
    this.type = type;
    this.isFail = false;
    this.isSuccess = false;

    if (type === 'error') {
      this.isFail = true;
    } else {
      this.isSuccess = true;
    }

    setTimeout(() => {
      this.isFail = false;
      this.isSuccess = false;
    }, this.delay * 1000);
  }
  onCancel() {
    this.isCancel = true;
    console.log('vao dayyyy', this.isCancel);
    this.onShowConfirmBox();
  }
}
