export interface FeedbackDataResponse {
    id: string;
    created_at: string;
    user_id?: string;
    content: string;
    category: string;
    email_sent: boolean;
    email: string;
}