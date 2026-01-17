import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
    selector: 'app-delete-account-dialog',
    imports: [ReactiveFormsModule],
    templateUrl: './delete-account-dialog.component.html',
    styleUrl: './delete-account-dialog.component.css'
})
export class DeleteAccountDialogComponent {
    deleteForm: FormGroup;
    loading = signal<boolean>(false);
    error = signal<string>('');

    onClose = output<void>();
    onDeleted = output<void>();

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    constructor() {
        this.deleteForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    close(): void {
        this.onClose.emit();
    }

    confirmDelete(): void {
        if (this.deleteForm.invalid) {
            return;
        }

        this.loading.set(true);
        this.error.set('');

        const password = this.deleteForm.get('password')?.value;

        this.authService.deleteAccount(password).subscribe({
            next: () => {
                this.loading.set(false);
                this.onDeleted.emit();
            },
            error: (error: any) => {
                this.loading.set(false);
                this.error.set(error.message || 'Failed to delete account');
            }
        });
    }
}
