export interface FeedbackRequest {
    user_id?: string;
    category: string;
    email: string;
    content: string;
}

export interface FeedbackResponse {
    id: string;
    message: string;
    email_sent: boolean;
}