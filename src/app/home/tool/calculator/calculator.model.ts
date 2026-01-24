export interface AssetCategory {
    id: string;
    name: string;
    amount: number;
    enabled: boolean;
}

export interface Currency {
    code: string;
    symbol: string;
    name: string;
    nisabDefault: number;
}

export interface Liabilities {
    debts: number;
    loans: number;
    bills: number;
}

export interface ZakatState {
    assetCategories: AssetCategory[];
    liabilities: Liabilities;
    selectedCurrencyCode: string;
}