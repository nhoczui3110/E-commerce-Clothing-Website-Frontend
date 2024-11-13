import { OrderItem } from './order-item.model';

export class Order {
  user: string;
  orderItems: OrderItem[];
  shippingAddress?: string;
  orderDate: Date;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Waiting';
  isPaid: boolean;
  paidAt?: Date;
  deliveryAt?: Date;
  totalCost: number;
  constructor(init?: Partial<Order>) {
    Object.assign(this, init);
    this.orderItems = init?.orderItems ? [...init.orderItems] : []; // Sao chép mảng `OrderItem` từ `init`
  }

  // Phương thức tính tổng giá trị đơn hàng

  test() {
    console.log('test');
  }
}
