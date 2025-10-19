export interface Surah {
    surah_id: number;
    name: string;
    name_transliteration: string;
    name_en: string;
    total_ayas: number;
}

export interface BookMarkedSurah {
    surah_id: number;
    ayah_id: number;
}