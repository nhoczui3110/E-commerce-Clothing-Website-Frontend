import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  form: FormGroup;
  isSuccess = false;
  isFail = false;
  message = '';
  delay = 3;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(9)]],
        phone: ['', Validators.required],
        confirmPassword: [''],
        gender: ['', Validators.required],
        birthday: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
  onSubmit() {
    console.log(this.form);
    this.isFail = false;
    this.isSuccess = false;
    this.userService.registerUser(this.form.value).subscribe({
      error: (err) => {
        this.isFail = true;
        this.message = err;
        setTimeout(() => {
          this.isFail = true;
        }, this.delay * 1000);
      },
      next: (res) => {
        this.isSuccess = true;
        this.message = 'Đăng ký thành công!';
        setTimeout(() => {
          this.isSuccess = true;
          this.router.navigate(['/login']);
        }, this.delay * 1000);
      },
    });
  }
}
