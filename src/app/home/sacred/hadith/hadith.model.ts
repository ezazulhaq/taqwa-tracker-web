export interface HadithChapters {
    id: string;
    chapter_no: number;
    chapter_name: string;
}

export interface Hadiths {
    id: string;
    source_name: string;
    chapter_name: string;
    hadith_no: number;
    text_en: string;
}

export interface HadithDetails {
    source_id:string;
    source_name:string;
    chapter_id:string;
    chapter_name:string;
    hadith_no:number;
}