import { Product } from './product.model';

export class CartItem {
  constructor(
    public product: Product,
    public color: string,
    public quantity: number,
    public size: string,
    public _id: string
  ) {}
}
