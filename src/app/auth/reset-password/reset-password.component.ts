import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule
],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  host: {
    class: "app-bg"
  }
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  error = signal<string>('');
  loading = signal<boolean>(false);

  token = signal<string>('');

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token.set(params['token'] || '');
      if (!this.token()) {
        this.error.set('Invalid or expired reset link');
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }

    return null;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const newPassword = this.resetPasswordForm.controls['password'].value;

    this.authService.resetPassword(this.token(), newPassword).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to update password');
        this.loading.set(false);
      }
    });
  }
}
