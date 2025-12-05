export interface Category {
    id: number;
    name: string;
    is_active: boolean;
}

export interface LibraryItem {
    id: number;
    name: string;
    pdf_name: string;
    category_id: number;
    category_name: string;
    storage_key: string;
    is_active: boolean;
}

export interface IslamicLibrary {
    name: string;
    pdfName: string;
    category: string;
    storageKey?: string;
    page?: number;
    totalPage?: number;
    zoom?: number;
}