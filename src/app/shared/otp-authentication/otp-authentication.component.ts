import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-otp-authentication',
  templateUrl: './otp-authentication.component.html',
  styleUrl: './otp-authentication.component.css',
})
export class OtpAuthenticationComponent implements AfterViewInit {
  canResendOtp: boolean = true;
  resendOtpTimer: any;
  remainingTime: number = 0;
  faClose = faClose;
  @Output() otpEvent: EventEmitter<any> = new EventEmitter();
  @ViewChildren('inputField') inputFields!: QueryList<
    ElementRef<HTMLInputElement>
  >;

  ngAfterViewInit() {
    // Lấy input đầu tiên và gọi focus
    const firstInput = this.inputFields.first.nativeElement;
    if (firstInput) {
      firstInput.focus();
    }
  }
  // onInput(event: Event) {
  //   const target = event.target as HTMLInputElement;
  //   const val = target.value;
  //   if (val !== '') {
  //     const next = target.nextElementSibling as HTMLInputElement;
  //     if (next) {
  //       next.value = '';
  //       next.focus();
  //     }
  //   }
  //   const next = target.nextElementSibling as HTMLInputElement;
  //   if (next) {
  //     next.focus();
  //   }
  // }

  onKeyUp(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const key = event.key.toLowerCase();
    console.log(key);
    if (key === 'backspace' || key === 'delete' || key === 'arrowleft') {
      if (key === 'backspace' || key === 'delete') {
        target.value = '';
      }
      const prev = target.previousElementSibling as HTMLInputElement;
      if (prev) {
        prev.focus();
      }
    } else if (key === 'arrowright') {
      const next = target.nextElementSibling as HTMLInputElement;
      if (next) {
        next.focus();
      }
    } else {
      if (isNaN(Number(key))) {
        target.value = '';
        return;
      }
      target.value = key;
      const next = target.nextElementSibling as HTMLInputElement;
      if (next) {
        next.focus();
      }
    }
  }

  startResendTimer() {
    const countdownTime = 15;
    this.remainingTime = countdownTime;

    this.resendOtpTimer = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime <= 0) {
        clearInterval(this.resendOtpTimer);
        this.canResendOtp = true;
        this.remainingTime = 0;
      }
    }, 1000);
  }

  onResendOtp() {
    if (this.canResendOtp) {
      this.otpEvent.emit('resend');
      this.canResendOtp = false; // Vô hiệu hóa nút
      this.startResendTimer(); // Bắt đầu đếm ngược 15 giây
    }
  }
  onSubmit() {
    let result = '';
    this.inputFields.forEach((inputField) => {
      const value = inputField.nativeElement.value;
      if (value === '') {
        return;
      }
      result += value;
    });
    if (result.length < 6) return;  
    this.otpEvent.emit(result);
  }
  onClose() {
    this.otpEvent.emit('close');
  }
}
