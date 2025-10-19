import { SearchHadithResponse } from "./search-hadith.model";

export interface FunctionResponse {
    data: SearchHadithResponse | null;
    error: FunctionError | null;
}

export type FunctionError = {
    name: string;
    context: any;
}