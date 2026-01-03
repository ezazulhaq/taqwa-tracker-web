import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { UserMetaData, User, SessionInfo } from '../model/auth.model';
import { DatePipe } from '@angular/common';

import { TitleComponent } from '../shared/title/title.component';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    TitleComponent,
    DatePipe
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
  sessions = signal<SessionInfo[]>([]);
  sessionLoading = signal<boolean>(false);
  sessionError = signal<string>('');

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  constructor() {
    this.user.set(this.authService.userMetaData());

    this.profileForm = this.fb.group({
      username: [this.user()?.username || '', [Validators.required, Validators.minLength(3)]],
      email: [{ value: this.user()?.email || '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.sessionLoading.set(true);
    const currentSessionId = this.authService.getSessionId();

    this.authService.getSessions().subscribe({
      next: (sessions) => {
        const updatedSessions = sessions.map(s => ({
          ...s,
          is_current: s.id === currentSessionId
        }));
        this.sessions.set(updatedSessions);
        this.sessionLoading.set(false);
      },
      error: (error) => {
        this.sessionError.set(error.message || 'Failed to load sessions');
        this.sessionLoading.set(false);
      }
    });
  }

  revokeSession(sessionId: string): void {
    if (!confirm('Are you sure you want to revoke this session?')) return;

    const isCurrent = sessionId === this.authService.getSessionId();

    this.authService.revokeSession(sessionId).subscribe({
      next: () => {
        if (isCurrent) {
          this.authService.logout().subscribe();
        } else {
          this.loadSessions();
        }
      },
      error: (error) => {
        this.sessionError.set(error.message || 'Failed to revoke session');
      }
    });
  }

  revokeAllSessions(): void {
    if (!confirm('Are you sure you want to revoke all other sessions?')) return;

    this.authService.revokeAllSessions().subscribe({
      next: () => {
        // After revoking all sessions, the current one might also be revoked 
        // depending on backend implementation. In our case, backend revokes ALL.
        // So we should logout.
        this.authService.logout().subscribe();
      },
      error: (error) => {
        this.sessionError.set(error.message || 'Failed to revoke all sessions');
      }
    });
  }

  getDeviceIcon(userAgent: string): string {
    userAgent = userAgent.toLowerCase();
    if (userAgent.includes('iphone') || userAgent.includes('android') && userAgent.includes('mobile')) return 'smartphone';
    if (userAgent.includes('ipad') || userAgent.includes('tablet')) return 'tablet';
    return 'desktop_windows';
  }

  getDeviceName(userAgent: string): string {
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('Android')) return 'Android Device';
    if (userAgent.includes('Windows')) return 'Windows PC';
    if (userAgent.includes('Macintosh')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux PC';
    return 'Unknown Device';
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
