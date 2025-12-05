export interface Surah {
    surah_id: number;
    name: string;
    name_transliteration: string;
    name_en: string;
    total_ayas: number;
    type: string;
    order_revealed: number;
    rukus: number;
}

export interface Ayah {
    surah_no: number;
    surah_name_ar: string;
    surah_name: string;
    ayah_no: number;
    arabic_text: string;
    translation_text: string;
    translator_name: string;
}


export interface Translator {
    name: string;
    full_name: string;
}

export interface BookMarkedSurah {
    surah_id: number;
    ayah_id: number;
}