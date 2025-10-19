import { HadithReference } from "../model/search-hadith.model";

export interface ChatbotMessage {
    role: string;
    content: string;
    links?: HadithReference[];
}