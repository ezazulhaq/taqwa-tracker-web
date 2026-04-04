import { ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZakatService } from '../../../../service/zakat.service';
import { TitleComponent } from '../../../../shared/title/title.component';
import { PopupComponent } from '../../../../shared/popup/popup.component';
import { ContributionCreate } from '../calculator.model';

@Component({
    selector: 'app-contribution-tracker',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TitleComponent,
        PopupComponent
    ],
    templateUrl: './contribution-tracker.component.html',
    styleUrl: './contribution-tracker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'app-bg'
    }
})
export class ContributionTrackerComponent implements OnInit {
    private fb = inject(FormBuilder);
    zakatService = inject(ZakatService);

    contributionForm!: FormGroup;
    isSubmitting = signal(false);
    submitSuccess = signal(false);
    reversingId = signal<string | null>(null);
    currentPage = signal(1);
    pageSize = 20;

    @ViewChild('confirmPopup') confirmPopup!: PopupComponent;
    @ViewChild('addPopup') addPopup!: PopupComponent;
    @ViewChild('resetPopup') resetPopup!: PopupComponent;
    pendingReversal = signal<{ id: string, amount: number, date: Date } | null>(null);
    isResetting = signal(false);

    // Expose Math to template
    Math = Math;

    ngOnInit(): void {
        this.initForm();
        this.loadData();
    }

    private initForm(): void {
        this.contributionForm = this.fb.group({
            amount: [0, [Validators.required, Validators.min(0.01)]],
            contribution_date: [new Date().toISOString().split('T')[0], Validators.required],
            notes: ['', Validators.maxLength(500)]
        });
    }

    private loadData(): void {
        this.zakatService.loadContributions(this.currentPage(), this.pageSize);
        this.zakatService.loadContributionSummary();
    }

    openAddPopup(): void {
        this.contributionForm.reset({
            amount: 0,
            contribution_date: new Date().toISOString().split('T')[0],
            notes: ''
        });
        this.submitSuccess.set(false);
        this.addPopup.show();
    }

    onSubmit(): void {
        if (this.contributionForm.valid && !this.isSubmitting()) {
            this.isSubmitting.set(true);
            this.submitSuccess.set(false);

            const formValue = this.contributionForm.value;
            const contribution: ContributionCreate = {
                amount: parseFloat(formValue.amount),
                contribution_date: new Date(formValue.contribution_date),
                notes: formValue.notes || undefined
            };

            this.zakatService.addContribution(contribution).subscribe({
                next: (success) => {
                    this.isSubmitting.set(false);
                    if (success) {
                        this.submitSuccess.set(true);
                        this.contributionForm.reset({
                            amount: 0,
                            contribution_date: new Date().toISOString().split('T')[0],
                            notes: ''
                        });
                        this.addPopup.close();
                        setTimeout(() => this.submitSuccess.set(false), 3000);
                    }
                },
                error: () => {
                    this.isSubmitting.set(false);
                }
            });
        }
    }

    formatCurrency(amount: number): string {
        const currency = this.zakatService.selectedCurrency();
        const locale = this.zakatService.selectedLocale();
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency.code,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    formatDate(date: Date | null): string {
        if (!date) return 'N/A';
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }

    getProgressPercentage(): number {
        const summary = this.zakatService.contributionSummary();
        if (!summary || summary.total_zakat_due === 0) return 0;
        return Math.min((summary.total_contributed / summary.total_zakat_due) * 100, 100);
    }

    loadPage(page: number): void {
        this.currentPage.set(page);
        this.zakatService.loadContributions(page, this.pageSize);
    }

    reverseContribution(contributionId: string, amount: number, date: Date): void {
        this.pendingReversal.set({ id: contributionId, amount, date });
        this.confirmPopup.show();
    }

    confirmReverse(): void {
        const reversal = this.pendingReversal();
        if (!reversal) return;

        this.reversingId.set(reversal.id);
        this.confirmPopup.close();

        this.zakatService.reverseContribution(reversal.id).subscribe({
            next: (success) => {
                this.reversingId.set(null);
                if (!success) {
                    alert('Failed to reverse contribution. Please try again.');
                }
            },
            error: () => {
                this.reversingId.set(null);
                alert('An error occurred while reversing the contribution.');
            }
        });
    }

    cancelReverse(): void {
        this.pendingReversal.set(null);
        this.confirmPopup.close();
    }

    isReversing(contributionId: string): boolean {
        return this.reversingId() === contributionId;
    }

    openResetPopup(): void {
        this.resetPopup.show();
    }

    cancelReset(): void {
        this.resetPopup.close();
    }

    confirmReset(): void {
        this.isResetting.set(true);
        this.resetPopup.close();

        this.zakatService.resetContributions().subscribe({
            next: (success) => {
                this.isResetting.set(false);
                if (!success) {
                    alert('Failed to reset contribution history. Please try again.');
                }
            },
            error: () => {
                this.isResetting.set(false);
                alert('An error occurred while resetting the contribution history.');
            }
        });
    }
}
