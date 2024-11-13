import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  animations: [
    trigger('toastAnimation', [
      state('in', style({ transform: 'translateX(0)', opacity: 1 })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('0.3s ease', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(
        ':leave',
        [animate('{{ fadeOutDuration }}s linear', style({ opacity: 0 }))],
        { params: { fadeOutDuration: 1 } }
      ), // Default to 1s fade out
    ]),
  ],
})
export class ToastComponent implements OnInit {
  @Input('type') type: string = 'success';
  @Input('title') title: string = 'Thành công';
  @Input('message') message: string = 'Thêm sản phẩm thành công';
  @Input('delay') delay: number = 1;
  showToast = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.showToast = false;
    }, this.delay * 1000);
  }
}
