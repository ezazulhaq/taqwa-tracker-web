import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssetCategory, Currency } from './calculator.model';
import { TitleComponent } from '../../../shared/title/title.component';

@Component({
  selector: 'app-calculator',
  imports: [
    CommonModule,
    TitleComponent,
    FormsModule
  ],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css',
  host: {
    class: 'app-bg'
  }
})
export class CalculatorComponent {
  zakatRate = 2.5; // 2.5% standard rate

  // Available currencies with default Nisab values
  currencies: Currency[] = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', nisabDefault: 85000 },
    { code: 'USD', symbol: '$', name: 'US Dollar', nisabDefault: 5000 },
    { code: 'EUR', symbol: '€', name: 'Euro', nisabDefault: 4500 },
    { code: 'GBP', symbol: '£', name: 'British Pound', nisabDefault: 3800 },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', nisabDefault: 18000 },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', nisabDefault: 18500 },
    { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', nisabDefault: 1400000 },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', nisabDefault: 22000 },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', nisabDefault: 78000000 },
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', nisabDefault: 550000 }
  ];

  selectedCurrency: Currency = this.currencies[0]; // INR as default
  nisabAmount = this.selectedCurrency.nisabDefault;

  assetCategories: AssetCategory[] = [
    { id: 'cash', name: 'Cash in Hand & Banks', amount: 0, enabled: true },
    { id: 'gold', name: 'Gold & Silver', amount: 0, enabled: true },
    { id: 'stocks', name: 'Stocks & Shares', amount: 0, enabled: true },
    { id: 'business', name: 'Business Assets', amount: 0, enabled: true },
    { id: 'property', name: 'Investment Property', amount: 0, enabled: true },
    { id: 'crypto', name: 'Cryptocurrency', amount: 0, enabled: true },
    { id: 'loans', name: 'Money Owed to You', amount: 0, enabled: true },
    { id: 'other', name: 'Other Assets', amount: 0, enabled: true }
  ];

  liabilities = {
    debts: 0,
    loans: 0,
    bills: 0
  };

  get totalAssets(): number {
    return this.assetCategories
      .filter(cat => cat.enabled)
      .reduce((sum, cat) => sum + (cat.amount || 0), 0);
  }

  get totalLiabilities(): number {
    return (this.liabilities.debts || 0) +
      (this.liabilities.loans || 0) +
      (this.liabilities.bills || 0);
  }

  get netAssets(): number {
    return this.totalAssets - this.totalLiabilities;
  }

  get isZakatDue(): boolean {
    return this.netAssets >= this.nisabAmount;
  }

  get zakatAmount(): number {
    if (!this.isZakatDue) return 0;
    return (this.netAssets * this.zakatRate) / 100;
  }

  onCurrencyChange(): void {
    this.nisabAmount = this.selectedCurrency.nisabDefault;
  }

  resetCalculator(): void {
    this.assetCategories.forEach(cat => {
      cat.amount = 0;
      cat.enabled = true;
    });
    this.liabilities = { debts: 0, loans: 0, bills: 0 };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }

  get currencySymbol(): string {
    return this.selectedCurrency.symbol;
  }

}
