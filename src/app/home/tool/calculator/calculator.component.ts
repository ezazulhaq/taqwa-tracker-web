

import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TitleComponent } from '../../../shared/title/title.component';
import { ZakatService } from '../../../service/zakat.service';
import { AuthService } from '../../../service/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { AmountFormatDirective } from '../../../shared/directive/amount-format.directive';
import { CalculatorToolComponent } from './calculator-tool/calculator-tool.component';
import { PopupComponent } from '../../../shared/popup/popup.component';

@Component({
  selector: 'app-calculator',
  imports: [
    TitleComponent,
    FormsModule,
    AmountFormatDirective,
    CalculatorToolComponent,
    RouterLink,
    PopupComponent
  ],

  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-bg'
  }
})
export class CalculatorComponent {
  public zakatService = inject(ZakatService);
  public authService = inject(AuthService);
  private toastService = inject(ToastService);
  public isSaving = signal(false);

  formatCurrency(value: number): string {
    return new Intl.NumberFormat(this.zakatService.selectedLocale(), {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }

  save() {
    if (!this.authService.isAuthenticated()) return;

    this.isSaving.set(true);
    this.zakatService.saveCalculationToBackend().subscribe({
      next: (success) => {
        this.isSaving.set(false);
        if (success) {
          this.toastService.show('Calculation saved successfully!');
        } else {
          this.toastService.show('Failed to save calculation.', 'error');
        }
      },
      error: () => {
        this.isSaving.set(false);
        this.toastService.show('An error occurred while saving.', 'error');
      }
    });
  }

  @ViewChild('resetPopup') resetPopup!: PopupComponent;
  public isResetting = signal(false);

  openResetPopup(): void {
    this.resetPopup.show();
  }

  cancelReset(): void {
    this.resetPopup.close();
  }

  confirmReset(): void {
    this.zakatService.resetCalculator();

    if (this.authService.isAuthenticated()) {
      this.isResetting.set(true);
      this.zakatService.resetContributions().subscribe({
        next: (success) => {
          this.isResetting.set(false);
          this.resetPopup.close();
          if (success) {
            this.toastService.show('Calculator and contribution history reset successfully!');
          } else {
            this.toastService.show('Calculator reset, but failed to delete history.', 'error');
          }
        },
        error: () => {
          this.isResetting.set(false);
          this.resetPopup.close();
          this.toastService.show('Calculator reset, but an error occurred deleting history.', 'error');
        }
      });
    } else {
      this.resetPopup.close();
      this.toastService.show('Calculator reset successfully!');
    }
  }
}

