import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { NgModule } from '@angular/core';
import { ProductDetailComponent } from './list-products/product/product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { AdminComponent } from './admin/admin.component';
import { ProductsComponent } from './admin/products/products.component';
import { ViewProductsComponent } from './admin/products/view-products/view-products.component';
import { AddProductComponent } from './admin/products/add-product/add-product.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { ViewOrdersComponent } from './admin/orders/view-orders/view-orders.component';
import { ConfigurationComponent } from './admin/configuration/configuration.component';
import { ChangeHeroSliderComponent } from './admin/configuration/change-hero-slider/change-hero-slider.component';
import { ViewProductDetailComponent } from './admin/products/view-product-detail/view-product-detail.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { ViewCategoryComponent } from './admin/admin-category/view-category/view-category.component';
import { AddCategoryComponent } from './admin/admin-category/add-category/add-category.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ProfileUserComponent } from './profile-user/profile-user.component';
import { OrderDetailComponent } from './admin/orders/view-orders/order-detail/order-detail.component';
import { ImportOrdersComponent } from './admin/import-orders/import-orders.component';
import { ViewImportOrdersComponent } from './admin/import-orders/view-import-orders/view-import-orders.component';
import { ImportOrdersDetailComponent } from './admin/import-orders/import-orders-detail/import-orders-detail.component';
import { AuthGuard } from './shared/service/auth.guard';
import { ChangePriceFilterComponent } from './admin/configuration/change-price-filter/change-price-filter.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'products', component: ListProductsComponent },
  { path: 'products/:slug', component: ProductDetailComponent },
  {
    path: 'orders/:id',
    canActivate: [AuthGuard],
    data: { role: 'customer' },
    component: OrderDetailComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard],
    data: { role: 'customer' },
  },
  {
    path: 'profile',
    component: ProfileUserComponent,
    canActivate: [AuthGuard],
    data: { role: 'customer' },
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      {
        path: 'products',
        component: ProductsComponent,
        children: [
          { path: '', redirectTo: 'view-products', pathMatch: 'full' },
          { path: 'view-products', component: ViewProductsComponent },
          { path: 'add-product', component: AddProductComponent },
          {
            path: 'view-products/:slug',
            component: ViewProductDetailComponent,
          },
        ],
      },
      {
        path: 'orders',
        component: OrdersComponent,
        children: [
          { path: '', redirectTo: 'view-orders', pathMatch: 'full' },
          { path: 'view-orders', component: ViewOrdersComponent },
          { path: 'view-orders/:id', component: OrderDetailComponent },
        ],
      },
      {
        path: 'import-orders',
        component: ImportOrdersComponent,
        children: [
          { path: '', redirectTo: 'view-import-orders', pathMatch: 'full' },
          { path: 'view-import-orders', component: ViewImportOrdersComponent },
          {
            path: 'view-import-orders/:id',
            component: ImportOrdersDetailComponent,
          },
        ],
      },
      {
        path: 'configuration',
        component: ConfigurationComponent,
        children: [
          { path: '', redirectTo: 'change-hero-slider', pathMatch: 'full' },
          { path: 'change-hero-slider', component: ChangeHeroSliderComponent },
          {
            path: 'change-price-filter',
            component: ChangePriceFilterComponent,
          },
        ],
      },
      {
        path: 'category',
        component: AdminCategoryComponent,
        children: [
          { path: '', redirectTo: 'view-category', pathMatch: 'full' },
          { path: 'view-category', component: ViewCategoryComponent },
          { path: 'add-category', component: AddCategoryComponent },
          { path: 'view-category/:slug', component: AddCategoryComponent },
        ],
      },
    ],
    canActivate: [AuthGuard],
    data: { role: 'admin' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
