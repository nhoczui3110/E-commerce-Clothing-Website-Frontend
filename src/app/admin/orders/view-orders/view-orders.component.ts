import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../shared/service/order.service';
import { Order } from '../../../shared/order.model';
import { OrderItem } from '../../../shared/order-item.model';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.css',
})
export class ViewOrdersComponent implements OnInit {
  orders: Order[];
  faX = faX;
  faCheck = faCheck;
  orderItems = [];
  isSuccess = false;
  isFail = false;
  message = '';
  delay = 3;
  fromDate = null;
  toDate = null;
  status = null;
  sortBy = null;
  order = null;
  currentPage = 1;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  isFetching = false;
  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 1;
      this.order = params['order'] || null;
      this.sortBy = params['sortBy'] || null;
      this.isFetching = true;
      this.orderService
        .getOrders(this.currentPage, {
          order: this.order,
          sortBy: this.sortBy,
          fromDate: this.fromDate,
          toDate: this.toDate,
          status: this.status,
        })
        .subscribe((res) => {
          console.log(res);
          this.pagination = {
            currentPage: res['currentPage'],
            totalPages: res['totalPages'],
          };
          this.orders = res['orders'];
          this.orders['isPaid'];
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
}
