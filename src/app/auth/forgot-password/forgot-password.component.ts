import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  host: {
    class: "app-bg"
  }
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  error = '';
  loading = false;
  returnUrl: string;
  resetEmailSent = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Get return URL from route parameters or default to home
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  onForgotPasswordSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const email = this.forgotPasswordForm.controls['email'].value;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.resetEmailSent = true;
      },
      error: (err) => {
        this.error = err.message || 'Forgot password failed';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
