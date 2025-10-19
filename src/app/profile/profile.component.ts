import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { UserMetaData, User } from '../model/auth.model';
import { CommonModule } from '@angular/common';
import { TitleComponent } from '../shared/title/title.component';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TitleComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  host: {
    class: "app-bg"
  }
})
export class ProfileComponent {

  profileForm: FormGroup;
  user = signal<UserMetaData | null>(null);
  updateSuccess = signal<boolean>(false);
  updateError = signal<string>('');
  loading = signal<boolean>(false);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  constructor() {
    this.user.set(this.authService.userMetaData());

    this.profileForm = this.fb.group({
      username: [this.user()?.username || '', [Validators.required, Validators.minLength(3)]],
      email: [{ value: this.user()?.email || '', disabled: true }]
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.loading.set(true);
    this.updateSuccess.set(false);
    this.updateError.set('');

    const newUsername = this.profileForm.get('username')?.value;

    // Call the auth service to update profile
    this.authService.updateProfile({ username: newUsername }).subscribe({
      next: (updatedUser) => {
        this.user.set(updatedUser);
        this.updateSuccess.set(true);
        this.loading.set(false);

        // Reset success message after 3 seconds
        setTimeout(() => {
          this.updateSuccess.set(false);
        }, 3000);
      },
      error: (error) => {
        this.updateError = error.message || 'Failed to update profile';
        this.loading.set(false);
      }
    });
  }

}
