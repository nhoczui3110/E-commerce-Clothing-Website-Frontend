import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../../shared/product.model';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../shared/service/product.service';
import { CartService } from '../../../shared/service/cart.service';
import { RecommendationService } from '../../../shared/service/recommendation.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product: Product;
  sizeList: { sizeName: string; stock: number }[] = [];
  chosenColor: string = null;
  chosenSize: string = null;
  quantity: number = 1;
  productId;
  isFail = false;
  isSuccess = false;
  message = '';
  delay = 3;
  averageRating: number;
  status = 'description';
  isFetching = false;
  limitNumberReviews = 6;
  recommendationProducts: Product[] = [];
  similarProducts: Product[] = [];
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private recommendationService: RecommendationService
  ) {}
  @ViewChild('mainImage', { static: false }) mainImage;
  ngOnInit(): void {
    this.isFetching = true;
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      forkJoin({
        recommendationProducts: this.recommendationService.getRecommendation(),
        productDetail: this.productService.getProductDetail(slug),
      }).subscribe((responses) => {
        // Xử lý phản hồi cho cả hai Observable
        this.recommendationProducts = responses.recommendationProducts;
        this.product = responses.productDetail;
        this.productId = (responses.productDetail as any)['_id'];
        this.chosenColor = this.product.variants[0].colorName;
        this.sizeList = this.product.variants[0].size;
        this.averageRating = this.product['averageRating'];

        // Sau khi đã có product detail, gọi thêm getSimilarProducts và gắn vào forkJoin
        this.recommendationService
          .getSimilarProducts(this.product._id)
          .subscribe((similarProducts) => {
            this.similarProducts = similarProducts;
            this.isFetching = false; // Gán dữ liệu vào biến hiển thị (nếu cần)
            window.scroll({
              top: 0,
              left: 0,
              behavior: 'smooth',
            });
          });
      });
    });
  }
  onIncreaseLimitNumberReviews() {
    if (this.limitNumberReviews >= this.product.reviews.length) return;
    this.limitNumberReviews += 6;
  }
  onChangeImage(imageUrl: string) {
    this.mainImage.nativeElement.setAttribute('src', imageUrl);
  }

  onChooseColor(imageUrl: string, colorItem: HTMLElement) {
    this.chosenColor = colorItem.textContent;
    this.chosenSize = null;
    document.querySelectorAll('.color-item').forEach((item) => {
      item.classList.remove('active');
    });
    document.querySelectorAll('.size-item').forEach((item) => {
      item.classList.remove('active');
    });
    colorItem.classList.add('active');
    this.onChangeImage(imageUrl);
    this.sizeList = this.product.variants.find(
      (v) => v.colorName === this.chosenColor
    ).size;
  }

  onChooseSize(sizeItem: HTMLElement) {
    this.quantity = 1;
    this.chosenSize = sizeItem.textContent;
    document.querySelectorAll('.size-item').forEach((item) => {
      item.classList.remove('active');
    });
    sizeItem.classList.add('active');
  }

  onIncreaseQuantity() {
    if (!this.chosenSize || !this.chosenColor) return;
    const variant = this.product.variants.find(
      (v) => v.colorName === this.chosenColor
    );

    if (variant) {
      const size = variant.size.find(
        (s) => s.sizeName === this.chosenSize.trim()
      );
      if (size) {
        if (this.quantity < size.stock) {
          this.quantity += 1;
        }
      }
    }
  }

  onDecreaseQuantity() {
    if (!this.chosenSize || !this.chosenColor) return;
    const variant = this.product.variants.find(
      (v) => v.colorName === this.chosenColor
    );

    if (variant) {
      const size = variant.size.find((s) => {
        console.log(s.sizeName, this.chosenSize);
        return s.sizeName === this.chosenSize.trim();
      });
      if (size) {
        if (this.quantity > 1) {
          this.quantity -= 1;
        }
      }
    }
  }

  onAddToCart() {
    if (!this.chosenColor || !this.chosenSize) {
      return;
    }
    this.isFail = false;
    this.isSuccess = false;
    this.cartService
      .addToCart({
        productId: this.productId,
        quantity: this.quantity,
        size: this.chosenSize.trim(),
        color: this.chosenColor.trim(),
      })
      .subscribe({
        error: (err) => {
          this.isFail = true;
          this.message = err;
          setTimeout(() => {
            this.isFail = false;
          }, this.delay * 1000);
        },
        next: (res) => {
          this.isSuccess = true;
          this.message = 'Thêm vào giỏ hàng thành công';
          setTimeout(() => {
            this.isSuccess = false;
          }, this.delay * 1000);
        },
      });
  }
  get fullStars(): number {
    return Math.floor(this.averageRating); // Số sao nguyên
  }

  get halfStar(): boolean {
    return this.averageRating % 1 !== 0; // Kiểm tra có sao lẻ không
  }

  get emptyStars(): number {
    return 5 - Math.ceil(this.averageRating); // Số sao trống
  }
  get halfStarGradient(): string {
    const decimalPart = this.averageRating % 1; // Phần thập phân
    const goldPercentage = Math.round(decimalPart * 100); // Tính phần trăm vàng
    const grayPercentage = 100 - goldPercentage; // Tính phần trăm xám
    return `linear-gradient(90deg, #ffcc00 ${goldPercentage}%, #e0e0e0 ${grayPercentage}%)`; // Tạo gradient
  }
  getRatingNumber(rating: number): number {
    return this.product.reviews.filter((review) => review.rating === rating)
      .length;
  }
  getRatingPercent(rating: number): number {
    return (this.getRatingNumber(rating) / this.product.reviews.length) * 100;
  }
}
