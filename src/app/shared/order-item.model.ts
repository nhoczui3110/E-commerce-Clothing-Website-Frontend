import { Product } from './product.model';

export class OrderItem {
  product: Product; // Chứa ID của sản phẩm
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  imageUrl?: string;
}
