import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();
  constructor(private el: ElementRef) {}
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // Kiểm tra nếu click ra ngoài phần tử có directive
    if (!this.el.nativeElement.contains(event.target)) {
      this.clickOutside.emit(); // Phát sự kiện clickOutside nếu click ra ngoài
    }
  }
}
