
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleComponent } from '../../../shared/title/title.component';
import { ZakatService } from '../../../service/zakat.service';
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

  formatCurrency(value: number): string {
    return new Intl.NumberFormat(this.zakatService.selectedLocale(), {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }
}

