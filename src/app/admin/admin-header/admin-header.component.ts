import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css',
})
export class AdminHeaderComponent {
  @Input('listFeature') listFeature: {
    featureName: string;
    featureUrl: string;
  }[] = [];
}
