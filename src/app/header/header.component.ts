import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/service/auth.service';
import { CategoryService } from '../shared/service/category.service';
import { CartService } from '../shared/service/cart.service';
import { CartItem } from '../shared/cart.model';
import { ProductService } from '../shared/service/product.service';
import { Product } from '../shared/product.model';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isLogin: boolean;
  categories = [];
  cart: CartItem[] = [];
  searchingProducts: Product[] = [];
  searchSubject: Subject<string> = new Subject();
  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.isLogin = this.authService.isLoggedIn();
    this.categoryService.getCategories().subscribe((res) => {
      this.categories = res['categories'];
    });
    this.cartService.getCart(5).subscribe((res) => {
      this.cart = res as CartItem[];
      console.log(this.cart);
    });
    this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap((keyword) => {
          return this.productService.searchOnProducts(keyword);
        })
      )
      .subscribe((res) => {
        console.log(res);
        this.searchingProducts = res as Product[]; // Lưu kết quả tìm kiếm vào biến
        console.log(this.searchingProducts);
      });
  }
  onLogout() {
    this.authService.logout();
  }
  getImageUrl(cartItem: CartItem) {
    return cartItem.product.variants.find((variant) => {
      return variant.colorName.trim() === cartItem.color.trim();
    })?.imageUrl;
  }

  onSearchProducts(keyword: string) {
    this.searchSubject.next(keyword); // Phát tán giá trị mới của từ khóa tìm kiếm
  }
  clearProducts() {
    this.searchingProducts = [];
  }
}
