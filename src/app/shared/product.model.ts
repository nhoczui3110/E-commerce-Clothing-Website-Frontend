export class Product {
  constructor(
    public name: string,
    public slug: string,
    public description: string,
    public category: {
      name: string;
      slug: string;
    },
    public price: number,
    public variants: {
      colorName: string;
      size: {
        sizeName: string;
        stock: number;
      }[];
      imageUrl: string;
    }[],
    public reviews?: {
      rating: number;
      comment: string;
      user: any;
    }[],
    public _id?: string,
    public averageRating?: number
  ) {}
}
