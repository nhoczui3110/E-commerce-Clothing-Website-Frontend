import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
})
export class StatusComponent {
  @Input('status') status: string = 'success';
  @Input('message') message: string = 'success';
  @Input('title') title: string = 'Success';
}
