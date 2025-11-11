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