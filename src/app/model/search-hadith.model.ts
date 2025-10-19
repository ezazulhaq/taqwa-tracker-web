export type SearchHadithResponse = {
    results: HadithReference[];
    summary: string;
}

export interface HadithReference {
    id: string;
    text: string;
    score: number;
    metadata: MetaData;
}

interface MetaData {
    book: string;
    chapter: string;
    hadith_number: number;
    namespace: string;
}
