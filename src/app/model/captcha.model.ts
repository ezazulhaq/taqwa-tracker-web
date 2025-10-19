export interface CaptchaChallenge {
    id: string;
    imageUrl: string;
    question: string;
}

export interface CaptchaResponse {
    challengeId: string;
    answer: string;
}