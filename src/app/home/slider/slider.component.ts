import { Component, Input } from '@angular/core';
import { Product } from '../../shared/product.model';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent {
  @Input('products') products: Product[];
  @Input('title') title: String;
  @Input('description') description: string;
}
