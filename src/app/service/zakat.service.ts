import { Injectable, signal, computed, effect } from '@angular/core';
import { AssetCategory, Currency, Liabilities, ZakatState } from '../home/tool/calculator/calculator.model';

@Injectable({
    providedIn: 'root'
})
export class ZakatService {
    private readonly STORAGE_KEY = 'taqwa_tracker_zakat_state';

    readonly currencies: Currency[] = [
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

    private readonly defaultAssetCategories: AssetCategory[] = [
        { id: 'cash', name: 'Cash in Hand & Banks', amount: 0, enabled: true },
        { id: 'gold', name: 'Gold & Silver', amount: 0, enabled: true },
        { id: 'stocks', name: 'Stocks & Shares', amount: 0, enabled: true },
        { id: 'pf', name: 'Provident Fund (PF)', amount: 0, enabled: true },
        { id: 'nps', name: 'National Pension System (NPS)', amount: 0, enabled: true },
        { id: 'business', name: 'Business Assets', amount: 0, enabled: true },
        { id: 'property', name: 'Investment Property', amount: 0, enabled: true },
        { id: 'rental', name: 'Rental Income', amount: 0, enabled: true },
        { id: 'crypto', name: 'Cryptocurrency', amount: 0, enabled: true },
        { id: 'loans', name: 'Money Owed to You', amount: 0, enabled: true },
        { id: 'other', name: 'Other Assets', amount: 0, enabled: true }
    ];

    private readonly defaultLiabilities: Liabilities = {
        debts: 0,
        loans: 0,
        bills: 0
    };

    // State Signals
    assetCategories = signal<AssetCategory[]>(this.defaultAssetCategories);
    liabilities = signal<Liabilities>(this.defaultLiabilities);
    selectedCurrencyCode = signal<string>(this.currencies[0].code);

    // Derived Signals
    selectedCurrency = computed(() =>
        this.currencies.find(c => c.code === this.selectedCurrencyCode()) || this.currencies[0]
    );

    selectedLocale = computed(() => {
        const mapping: Record<string, string> = {
            'INR': 'en-IN',
            'USD': 'en-US',
            'EUR': 'de-DE',
            'GBP': 'en-GB',
            'AED': 'ar-AE',
            'SAR': 'ar-SA',
            'PKR': 'en-PK',
            'MYR': 'ms-MY',
            'IDR': 'id-ID',
            'BDT': 'bn-BD'
        };
        return mapping[this.selectedCurrencyCode()] || 'en-US';
    });

    nisabAmount = computed(() => this.selectedCurrency().nisabDefault);

    totalAssets = computed(() =>
        this.assetCategories()
            .filter(cat => cat.enabled)
            .reduce((sum, cat) => sum + (cat.amount || 0), 0)
    );

    totalLiabilities = computed(() => {
        const l = this.liabilities();
        return (l.debts || 0) + (l.loans || 0) + (l.bills || 0);
    });

    netAssets = computed(() => this.totalAssets() - this.totalLiabilities());

    isZakatDue = computed(() => this.netAssets() >= this.nisabAmount());

    zakatAmount = computed(() => {
        if (!this.isZakatDue()) return 0;
        return (this.netAssets() * 2.5) / 100;
    });

    constructor() {
        this.loadFromStorage();

        // Auto-save on state changes
        effect(() => {
            const state: ZakatState = {
                assetCategories: this.assetCategories(),
                liabilities: this.liabilities(),
                selectedCurrencyCode: this.selectedCurrencyCode()
            };
            this.saveToStorage(state);
        });
    }

    private loadFromStorage(): void {
        try {
            const storedData = localStorage.getItem(this.STORAGE_KEY);
            if (storedData) {
                const state: ZakatState = JSON.parse(storedData);

                // Merge stored asset categories with defaults to ensure new fields (like PF/NPS) appear
                if (state.assetCategories) {
                    const mergedAssets = this.defaultAssetCategories.map(defaultCat => {
                        const storedCat = state.assetCategories.find(sc => sc.id === defaultCat.id);
                        return storedCat ? { ...defaultCat, amount: storedCat.amount, enabled: storedCat.enabled } : defaultCat;
                    });
                    this.assetCategories.set(mergedAssets);
                } else {
                    this.assetCategories.set(this.defaultAssetCategories);
                }

                this.liabilities.set(state.liabilities || this.defaultLiabilities);
                this.selectedCurrencyCode.set(state.selectedCurrencyCode || this.currencies[0].code);
            }
        } catch (error) {
            console.error('Error loading Zakat state from storage:', error);
        }
    }

    private saveToStorage(state: ZakatState): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error('Error saving Zakat state to storage:', error);
        }
    }

    updateAssetAmount(id: string, amount: number): void {
        this.assetCategories.update(categories =>
            categories.map(cat => cat.id === id ? { ...cat, amount } : cat)
        );
    }

    toggleAssetEnabled(id: string, enabled: boolean): void {
        this.assetCategories.update(categories =>
            categories.map(cat => cat.id === id ? { ...cat, enabled } : cat)
        );
    }

    updateLiabilities(liabilities: Partial<Liabilities>): void {
        this.liabilities.update(l => ({ ...l, ...liabilities }));
    }

    setCurrency(code: string): void {
        this.selectedCurrencyCode.set(code);
    }

    resetCalculator(): void {
        this.assetCategories.set(this.defaultAssetCategories.map(cat => ({ ...cat, amount: 0, enabled: true })));
        this.liabilities.set(this.defaultLiabilities);
        // Keep currency as is or reset to default? Usually keep currency is better.
    }
}
