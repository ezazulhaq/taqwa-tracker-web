export interface ChatbotMessage {
    role: string;
    content: string;
}
export interface ChatRequest {
    user_id: string;
    conversation_id: string;
    message: string;
}

export interface ChatResponse {
    conversation_id: string;
    message_id: string;
    role: string;
    content: string;
    metadata?: any;
    created_at: string;
}

export interface Conversation {
    id: string;
    user_id: string;
    title: string;
    created_at: string;
    updated_at: string;
    message_count: number;
    last_message_at: string;
}