import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FeedbackService } from '../service/feedback.service';
import { SuccessComponent } from './success/success.component';
import { Router } from '@angular/router';
import { TitleComponent } from '../shared/title/title.component';
import { AuthService } from '../service/auth.service';
import { CaptchaComponent } from '../shared/captcha/captcha.component';

@Component({
  selector: 'app-feedback',
  imports: [
    ReactiveFormsModule,
    SuccessComponent,
    TitleComponent,
    CaptchaComponent,
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
  host: {
    class: "app-bg"
  }
})
export class FeedbackComponent {
  feedbackForm: FormGroup;
  isSubmitting = signal<boolean>(false);
  submitSuccess = signal<boolean>(false);
  submitError: string | null = null;
  isAuthenticated = signal<boolean>(false);

  captchaVerified = false;
  showCaptcha = true; // Show CAPTCHA after first failed attempt or always

  constructor(
    private readonly router: Router,
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private authService: AuthService
  ) {
    this.feedbackForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]],
      email: [authService.currentUser()?.email || '', [Validators.required, Validators.email]],
      category: ['General']
    });
    this.isAuthenticated.set(this.authService.isAuthenticated());
  }

  redirectToHome() {
    this.router.navigate(['/home']);
  }

  onCaptchaVerified(isVerified: boolean): void {
    this.captchaVerified = isVerified;
    this.feedbackForm.patchValue({ captcha: isVerified });
  }

  onSubmit() {
    if (this.feedbackForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.feedbackForm.controls).forEach(key => {
        this.feedbackForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.showCaptcha && !this.captchaVerified) {
      this.submitError = 'Please complete the CAPTCHA verification';
      return;
    }

    this.isSubmitting.set(true);
    this.submitError = null;

    this.feedbackService.processFeedback({
      content: this.feedbackForm.value.content,
      email: this.feedbackForm.value.email,
      category: this.feedbackForm.value.category
    }).subscribe({
      next: (result) => {
        if (result.success) {
          this.submitSuccess.set(true);
          this.feedbackForm.reset({ category: 'General' });
        } else {
          this.submitError = 'Failed to submit feedback. Please try again.';
        }
        this.isSubmitting.set(false);
      },
      error: () => {
        this.submitError = 'An unexpected error occurred.';
        this.isSubmitting.set(false);

        // Show CAPTCHA after failed login attempt
        this.showCaptcha = true;
        this.captchaVerified = false;
        this.feedbackForm.patchValue({ captcha: false });
      }
    });
  }

  get isFormValid(): boolean {
    const basicFormValid = this.feedbackForm.valid;
    const captchaValid = !this.showCaptcha || this.captchaVerified;
    return basicFormValid && captchaValid;
  }
}
