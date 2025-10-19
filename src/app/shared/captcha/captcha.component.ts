import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CaptchaChallenge } from '../../model/captcha.model';
import { CaptchaService } from '../../service/captcha.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-captcha',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CaptchaComponent),
      multi: true
    }
  ],
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.css'
})
export class CaptchaComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() showTypeSelector = false;
  @Input() challengeType: 'math' | 'text' = 'math';
  @Output() verified = new EventEmitter<boolean>();

  currentChallenge: CaptchaChallenge | null = null;
  answerControl = new FormControl('');
  isVerified = false;
  hasError = false;
  errorMessage = '';
  isVerifying = false;

  private subscription = new Subscription();
  private onChange = (value: boolean) => { };
  private onTouched = () => { };

  constructor(private captchaService: CaptchaService) { }

  ngOnInit() {
    this.generateNewChallenge();

    this.subscription.add(
      this.captchaService.currentChallenge$.subscribe(challenge => {
        this.currentChallenge = challenge;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.isVerified = value || false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.answerControl.disable();
    } else {
      this.answerControl.enable();
    }
  }

  generateNewChallenge() {
    this.captchaService.refreshChallenge(this.challengeType);
    this.resetState();
  }

  refreshCaptcha() {
    this.generateNewChallenge();
  }

  verify() {
    if (!this.currentChallenge || !this.answerControl.value) {
      return;
    }

    this.isVerifying = true;
    this.hasError = false;
    this.errorMessage = '';

    // Simulate network delay for better UX
    setTimeout(() => {
      const isValid = this.captchaService.verifyCaptcha({
        challengeId: this.currentChallenge!.id,
        answer: this.answerControl.value!.trim()
      });

      if (isValid) {
        this.isVerified = true;
        this.hasError = false;
        this.onChange(true);
        this.verified.emit(true);
      } else {
        this.hasError = true;
        this.errorMessage = 'Incorrect answer. Please try again.';
        this.isVerified = false;
        this.onChange(false);
        this.verified.emit(false);
        // Generate new challenge after wrong answer
        setTimeout(() => this.generateNewChallenge(), 1500);
      }

      this.isVerifying = false;
      this.onTouched();
    }, 500);
  }

  private resetState() {
    this.isVerified = false;
    this.hasError = false;
    this.errorMessage = '';
    this.answerControl.setValue('');
    this.onChange(false);
  }
}
