import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { ChatRequest, ChatResponse } from '../chatbot/chatbot.model';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly API_BASE_URL = environment.apiBaseUrl;
  private conversationId: string | null = null;

  queryIslam(message: string): Observable<ChatResponse> {
    const user = this.authService.currentUser();
    if (!user) {
      return throwError(() => new Error('User must be authenticated'));
    }

    const request: ChatRequest = {
      user_id: user.id,
      conversation_id: this.conversationId || crypto.randomUUID(),
      message
    };

    return this.http.post<ChatResponse>(`${this.API_BASE_URL}/chat/agent`, request).pipe(
      map(response => {
        // Store conversation ID from API response
        if (!this.conversationId) {
          this.conversationId = response.conversation_id;
        }
        return response;
      }),
      catchError(error => {
        console.error('Chat API error:', error);
        return throwError(() => new Error('Failed to get response from Islamic chatbot'));
      })
    );
  }

  clearConversation(): void {
    this.conversationId = null;
  }
}
