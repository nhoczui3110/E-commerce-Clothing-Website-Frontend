import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { UserService } from '../shared/service/user.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { OrderService } from '../shared/service/order.service';
import { Order } from '../shared/order.model';
import {
  faCamera,
  faCartShopping,
  faLocation,
  faLock,
  faStar,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { error } from 'console';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.css',
})
export class ProfileUserComponent implements OnInit {
  @ViewChild('profileWrapper') profileWrapper!: ElementRef;
  status: string = 'info';
  ratedProductId = null;
  user: {};
  isFail = false;
  isSuccess = false;
  delay = 3;
  message = '';
  selectedFile!: File;
  form: FormGroup;
  chosenStatus = null;
  isFetching = false;
  isShowRating = false;
  orders: Order[];
  ratings = [];
  isShowStatus = false;
  isRated = true;
  dataRating: { rating: number; comment: string } = null;
  isEditRating = false;
  isShowImageCropper = false;
  isShowOtpBox = false;
  faCamera = faCamera;
  formChangePassword: FormGroup;
  formattedDate: string;
  faUser = faUser;
  faLocation = faLocation;
  faLock = faLock;
  faCartShopping = faCartShopping;
  faStar = faStar;
  @ViewChildren('featureItem')
  featureList: QueryList<ElementRef>;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {}
  ngOnInit(): void {
    const now = new Date();
    this.formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(now);
    console.log(this.featureList);
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      birthday: ['', Validators.required],
      avatar: [''],
    });
    this.formChangePassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(9)]],
      newPassword: ['', [Validators.required, Validators.minLength(9)]],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          this.confirmPasswordValidator.bind(this),
        ],
      ],
    });
    // this.userService
    //   .ratingProduct('6707f6428cb24986165d1511', 4)
    //   .subscribe((res) => {
    //     console.log(res);
    //   });
    this.onGetUserProfile();
  }
  onShowProfile(event) {
    this.status = 'info';
    this.onGetUserProfile();
    this.featureList.toArray().forEach((featureItem) => {
      featureItem.nativeElement.style.backgroundColor = null;
      featureItem.nativeElement.style.color = null;
    });
    event.target.style.backgroundColor = 'var(--primary-green)';
    event.target.style.color = '#ffffff';
  }
  onShowAddress(event) {
    this.status = 'address';
    this.featureList.toArray().forEach((featureItem) => {
      featureItem.nativeElement.style.backgroundColor = null;
      featureItem.nativeElement.style.color = null;
    });
    event.target.style.backgroundColor = 'var(--primary-green)';
    event.target.style.color = '#ffffff';
  }
  onShowOrders(event) {
    this.status = 'order';
    this.getUserOrders();
    this.featureList.toArray().forEach((featureItem) => {
      featureItem.nativeElement.style.backgroundColor = null;
      featureItem.nativeElement.style.color = null;
    });
    event.target.style.backgroundColor = 'var(--primary-green)';
    event.target.style.color = '#ffffff';
  }
  onShowRatingProduct(event) {
    this.status = 'rating-product';
    this.getRatings();
    this.featureList.toArray().forEach((featureItem) => {
      featureItem.nativeElement.style.backgroundColor = null;
      featureItem.nativeElement.style.color = null;
    });
    event.target.style.backgroundColor = 'var(--primary-green)';
    event.target.style.color = '#ffffff';
  }
  onShowChangePassword(event) {
    this.status = 'change-password';
    this.featureList.toArray().forEach((featureItem) => {
      featureItem.nativeElement.style.backgroundColor = null;
      featureItem.nativeElement.style.color = null;
    });
    event.target.style.backgroundColor = 'var(--primary-green)';
    event.target.style.color = '#ffffff';
  }
  confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = this.formChangePassword?.get('newPassword')?.value;
    const confirmPassword = control.value;

    return newPassword && confirmPassword !== newPassword
      ? { passwordMismatch: true }
      : null;
  }
  onSubmitChangePassword() {
    if (this.formChangePassword.invalid) {
      this.formChangePassword.markAllAsTouched();
      return;
    }
    this.isFetching = true;
    this.userService
      .requestChangePassword(this.formChangePassword.value.password)
      .subscribe({
        error: (err) => {
          this.isFetching = false;
          this.isFail = true;
          console.log(err);
          this.message = err;
          setTimeout(() => {
            this.isFail = false;
          }, this.delay * 1000);
        },
        next: (res) => {
          this.isFetching = false;
          this.isSuccess = true;
          this.message = res['message'];
          this.isShowOtpBox = true;
          setTimeout(() => {
            this.isSuccess = false;
          }, this.delay * 1000);
        },
      });
  }
  // onFileSelected(event: Event) {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     this.selectedFile = fileInput.files[0];
  //   }
  // }
  onGetUserProfile() {
    this.setFalseStatus();
    this.userService.getProfileUser().subscribe({
      error: (err) => {
        this.isFail = true;
        this.message = err;
        setTimeout(() => {
          this.isFail = false;
        }, this.delay * 1000);
      },
      next: (res) => {
        console.log(res);
        const birthday = new Date(res['birthday']).toISOString().split('T')[0];
        this.user = res;
        this.user['birthday'] = birthday;
        // Cập nhật dữ liệu vào form
        this.form.patchValue({
          firstName: res['firstName'],
          lastName: res['lastName'],
          email: res['email'],
          phone: res['phone'],
          address: res['address'],
          gender: res['gender'] ? '1' : '0',
          birthday: birthday,
        });
      },
    });
  }

  changeStatus(status: string) {
    this.status = status;
  }
  setFalseStatus() {
    this.isSuccess = false;
    this.isFail = false;
  }
  onSaveUser() {
    console.log(this.form);
    if (this.form.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.form.get('firstName')?.value);
    formData.append('lastName', this.form.get('lastName')?.value);
    formData.append('email', this.form.get('email')?.value);
    formData.append('phone', this.form.get('phone')?.value);
    formData.append('address', this.form.get('address')?.value);
    formData.append('gender', this.form.get('gender')?.value);
    formData.append('birthday', this.form.get('birthday')?.value);
    formData.append('img', this.selectedFile);
    console.log(this.selectedFile);
    this.userService.updateProfileUser(formData).subscribe({
      next: (res) => {
        this.isSuccess = true;
        this.message = 'Save user thành công';
        setTimeout(() => {
          this.isSuccess = false;
        }, this.delay * 1000);
        this.user = res;
        const birthday = new Date(res['birthday']).toISOString().split('T')[0];
        this.user['birthday'] = birthday;
      },
      error: (err) => {
        this.isFail = true;
        this.message = err;
        setTimeout(() => {
          this.isFail = false;
        }, this.delay * 1000);
      },
    });
  }
  getUserOrders() {
    this.isFetching = true;
    this.orderService.getUserOrders(this.chosenStatus).subscribe((res) => {
      this.orders = res as Order[];
      console.log(this.orders);
      this.isFetching = false;
    });
  }
  getRatings() {
    this.isFetching = true;
    this.userService.getRatings({ isRated: this.isRated }).subscribe((res) => {
      this.ratings = res as [];
      console.log(this.ratings);
      if (this.ratings.length === 0) {
        this.isShowStatus = true;
      }
      this.isFetching = false;
    });
  }
  onShowOrdersByStatus(status) {
    this.chosenStatus = status;
    this.getUserOrders();
  }
  handleRatingProduct(res) {
    this.isShowRating = false;
    this.isEditRating = null;
    console.log(res);
    if (!res) {
      return;
    }
    this.userService
      .ratingProduct(this.ratedProductId, res['rating'], res['comment'])
      .subscribe({
        error: (err) => {
          this.isFail = true;
          this.message = err;
          setTimeout(() => {
            this.isFail = false;
          }, this.delay * 1000);
        },
        next: (res) => {
          this.isSuccess = true;
          this.message = res['message'];
          this.getRatings();
          setTimeout(() => {
            this.isSuccess = false;
          }, this.delay * 1000);
        },
      });
  }
  onShowRating(productId) {
    this.isShowRating = true;
    this.ratedProductId = productId;
  }
  onGetRatingProduct({ isRated }: { isRated?: boolean }) {
    this.isRated = isRated;
    this.getRatings();
  }
  onEditRating(rating) {
    this.dataRating = { rating: rating['rating'], comment: rating['comment'] };
    this.ratedProductId = rating.product._id;
    this.isShowRating = true;
  }
  onShowEditAvatar() {
    this.isShowImageCropper = true;
  }
  handleEditAvatar(croppedBlob: Blob | null) {
    this.isShowImageCropper = false;

    if (croppedBlob) {
      const formData = new FormData();
      formData.append('img', croppedBlob, 'avatar.png'); // Đặt tên tệp nếu cần

      this.userService.updateProfileUser(formData).subscribe({
        error: (err) => {
          this.isFail = true;
          this.message = err;
          setTimeout(() => {
            this.isFail = false;
          }, this.delay * 1000);
        },
        next: (res) => {
          this.isSuccess = true;
          this.message = 'Thay đổi avatar thành công';
          this.user = res;
          setTimeout(() => {
            this.isSuccess = false;
          }, this.delay * 1000);
        },
      });
    }
  }
  handleChangePassword(res) {
    if (res === 'close' || !res) {
      this.isShowOtpBox = false;
    }
    if (res === 'resend') {
      this.userService
        .requestChangePassword(this.formChangePassword.value.password)
        .subscribe({
          error: (err) => {
            this.isFetching = false;
            this.isFail = true;
            console.log(err);
            this.message = err;
            setTimeout(() => {
              this.isFail = false;
            }, this.delay * 1000);
          },
          next: (res) => {
            this.isFetching = false;
            this.isSuccess = true;
            this.message = res['message'];
            setTimeout(() => {
              this.isSuccess = false;
            }, this.delay * 1000);
          },
        });
    } else {
      this.userService
        .confirmChangePassword(res, this.formChangePassword.value.newPassword)
        .subscribe({
          error: (err) => {
            this.isFetching = false;
            this.isFail = true;
            console.log(err);
            this.message = err;
            setTimeout(() => {
              this.isFail = false;
            }, this.delay * 1000);
          },
          next: (res) => {
            this.isFetching = false;
            this.isSuccess = true;
            this.message = res['message'];
            this.isShowOtpBox = false;
            setTimeout(() => {
              this.isSuccess = false;
            }, this.delay * 1000);
          },
        });
    }
  }
}
