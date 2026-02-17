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

export type ContributionType = 'contribution' | 'reversal';

export interface ZakatContribution {
    id: string;
    user_id: string;
    amount: number;
    contribution_date: Date;
    notes: string | null;
    contribution_type?: ContributionType;  // Optional for backward compatibility
    reversed_contribution_id?: string | null;
    is_reversed?: boolean;                 // Optional for backward compatibility
    created_at: Date;
}

export interface ContributionCreate {
    amount: number;
    contribution_date: Date;
    notes?: string;
    reversed_contribution_id?: string;
}

export interface ContributionSummary {
    total_zakat_due: number;
    total_contributed: number;
    remaining_balance: number;
    contribution_count: number;
    last_contribution_date: Date | null;
}

export interface ContributionListResponse {
    contributions: ZakatContribution[];
    total_count: number;
    page: number;
    page_size: number;
    total_pages: number;
}