import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  delay = 3;
  failLogin = null;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.failLogin = false;
    if (this.loginForm.invalid) return;

    this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: () => {
          const role = this.authService.getRole(); // Lấy role sau khi login hoàn tất
          console.log(role);

          if (role && role.toLowerCase().trim() === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate([this.authService.returnUrl]);
          }
        },
        error: (error) => {
          this.failLogin = true;
          console.log(this.failLogin);
          setTimeout(() => {
            this.failLogin = false;
          }, this.delay * 1000);
        },
      });
  }
}
