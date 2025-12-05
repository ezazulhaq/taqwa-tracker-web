import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { FeedbackRequest, FeedbackResponse } from "./feedback.model";

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiBaseUrl;

    submitFeedback(feedbackData: FeedbackRequest): Observable<FeedbackResponse> {
        return this.http.post<FeedbackResponse>(`${this.apiUrl}/support/feedback`, feedbackData);
    }




}