export interface Translation {
    ayah_number: number;
    arabic_text_original: string;
    translation: string;
    transliteration: string;
}

export interface Translator {
    name: string;
    full_name: string;
}