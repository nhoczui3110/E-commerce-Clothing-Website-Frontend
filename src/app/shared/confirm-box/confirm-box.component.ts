import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrl: './confirm-box.component.css',
})
export class ConfirmBoxComponent {
  @Output() confirmEvent: EventEmitter<boolean> = new EventEmitter();
  @Input('title') title: string = 'Delete your product?';
  @Input('msg') msg: string =
    'This action is final and you will be unable to recover any data';
  onConfirm() {
    this.confirmEvent.emit(true);
  }
  onCancel() {
    this.confirmEvent.emit(false);
  }
}
