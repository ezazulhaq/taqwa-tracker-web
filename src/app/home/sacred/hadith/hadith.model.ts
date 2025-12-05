export interface HadithChapters {
    id: string;
    source_id: string;
    chapter_no: number;
    chapter_name: string;
}

export interface HadithSource {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
}

export interface Hadiths {
    id: string;
    source_name: string;
    chapter_name: string;
    hadith_no: number;
    text_en: string;
}

export interface HadithDetail {
    id: string;
    source_id: string;
    source_name: string;
    chapter_id: string;
    chapter_no: number;
    chapter_name: string;
    hadith_no: number;
    text_en: string;
}