import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
})
export class RatingComponent implements OnInit {
  @Output() rateEvent: EventEmitter<any> = new EventEmitter();
  @Input('data') data: { rating: number; comment: string };
  rating: number;
  comment: string = '';
  ngOnInit(): void {
    if (this.data) {
      this.comment = this.data.comment;
      this.rating = this.data.rating;
    }
  }
  onChooseRate(rate: number, event) {
    this.rating = rate;

    // Đặt background cho tất cả các mục đánh giá về trong suốt
    document.querySelectorAll('.rating-item .emote').forEach((item) => {
      (item as HTMLElement).style.border = null;
    });

    event.currentTarget.querySelector('.emote').style.border =
      '4px solid #f5ebba';
  }
  onSubmit() {
    console.log(this.rating, this.comment);
    if (!this.comment || !this.rating) return;
    this.rateEvent.emit({ rating: this.rating, comment: this.comment });
  }
  onCancel() {
    this.rateEvent.emit(false);
  }
}
