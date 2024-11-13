import { Component, Input } from '@angular/core';
import { Product } from '../../shared/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  @Input('product') product: Product;
  faCircleInfo = faCircleInfo;
  constructor(private router: Router, private route: ActivatedRoute) {}

  onViewDetail() {
    this.router.navigate(['./', this.product.slug], { relativeTo: this.route });
  }
  hoverImage(isHovered, event) {
    const productImage = event.target;
    productImage.style.transform = isHovered ? 'scale(1.1)' : 'scale(1)';
  }
}
