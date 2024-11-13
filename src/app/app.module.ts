import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HeroSliderComponent } from './home/hero-slider/hero-slider.component';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './home/category/category.component';
import { SliderComponent } from './home/slider/slider.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { AppRoutingModule } from './app-routing.module';
import { ProductComponent } from './list-products/product/product.component';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { ProductDetailComponent } from './list-products/product/product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { AdminComponent } from './admin/admin.component';
import { ProductsComponent } from './admin/products/products.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { ViewProductsComponent } from './admin/products/view-products/view-products.component';
import { AddProductComponent } from './admin/products/add-product/add-product.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { ViewOrdersComponent } from './admin/orders/view-orders/view-orders.component';
import { ConfigurationComponent } from './admin/configuration/configuration.component';
import { ChangeHeroSliderComponent } from './admin/configuration/change-hero-slider/change-hero-slider.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastComponent } from './shared/toast/toast.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingComponent } from './shared/loading/loading.component';
import { ViewProductDetailComponent } from './admin/products/view-product-detail/view-product-detail.component';
import { ConfirmBoxComponent } from './shared/confirm-box/confirm-box.component';
import { ViewCategoryComponent } from './admin/admin-category/view-category/view-category.component';
import { AddCategoryComponent } from './admin/admin-category/add-category/add-category.component';
import { RouterModule } from '@angular/router';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { CurrencyFormatterPipe } from './shared/pipe/currency-formatter.pipe';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ProfileUserComponent } from './profile-user/profile-user.component';
import { OrderDetailComponent } from './admin/orders/view-orders/order-detail/order-detail.component';
import { ImportOrdersComponent } from './admin/import-orders/import-orders.component';
import { ViewImportOrdersComponent } from './admin/import-orders/view-import-orders/view-import-orders.component';
import { ImportOrdersDetailComponent } from './admin/import-orders/import-orders-detail/import-orders-detail.component';
import { FormAddNewAddressComponent } from './shared/form-add-new-address/form-add-new-address.component';
import { AuthInterceptor } from './shared/service/auth.interceptor';
import { FormatDatePipe } from './shared/pipe/format-date.pipe';
import { StatusComponent } from './shared/status/status.component';
import { AddressComponent } from './shared/address/address.component';
import { RatingComponent } from './shared/rating/rating.component';
import { ImageCropperComponent } from './shared/image-cropper/image-cropper.component';
import { ImageCropperComponent as ImageCropperComponentFromNgx } from 'ngx-image-cropper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OtpAuthenticationComponent } from './shared/otp-authentication/otp-authentication.component';
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';
import { ChangePriceFilterComponent } from './admin/configuration/change-price-filter/change-price-filter.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeroSliderComponent,
    HomeComponent,
    CategoryComponent,
    SliderComponent,
    ListProductsComponent,
    ProductComponent,
    PaginationComponent,
    ProductDetailComponent,
    CartComponent,
    AdminComponent,
    ProductsComponent,
    AdminHeaderComponent,
    ViewProductsComponent,
    AddProductComponent,
    OrdersComponent,
    ViewOrdersComponent,
    ConfigurationComponent,
    ChangeHeroSliderComponent,
    ToastComponent,
    LoadingComponent,
    ViewProductDetailComponent,
    ConfirmBoxComponent,
    ViewCategoryComponent,
    AddCategoryComponent,
    AdminCategoryComponent,
    CurrencyFormatterPipe,
    LoginComponent,
    SignUpComponent,
    ProfileUserComponent,
    OrderDetailComponent,
    ImportOrdersComponent,
    ViewImportOrdersComponent,
    ImportOrdersDetailComponent,
    FormAddNewAddressComponent,
    FormatDatePipe,
    StatusComponent,
    AddressComponent,
    RatingComponent,
    ImageCropperComponent,
    OtpAuthenticationComponent,
    ClickOutsideDirective,
    ChangePriceFilterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    ImageCropperComponentFromNgx,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
