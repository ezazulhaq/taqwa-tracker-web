
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleComponent } from '../../../shared/title/title.component';
import { ZakatService } from '../../../service/zakat.service';
import { AuthService } from '../../../service/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { AmountFormatDirective } from '../../../shared/directive/amount-format.directive';

@Component({
  selector: 'app-calculator',
  imports: [
    TitleComponent,
    FormsModule,
    AmountFormatDirective
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
}

