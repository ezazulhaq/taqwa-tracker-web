import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { ChatRequest, ChatResponse, Conversation } from '../chatbot/chatbot.model';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly API_BASE_URL = environment.apiBaseUrl;
  private conversationId: string | null = null;

  convertToHtml(markdown: string): string {
    let html = markdown;

    // Convert bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:underline">$1</a>');

    // Convert bullet points
    html = html.replace(/^\* (.+)$/gm, '<li class="ml-4">• $1</li>');

    // Wrap consecutive list items in ul tags
    html = html.replace(/(<li[^>]*>.*<\/li>\s*)+/gs, '<ul class="space-y-1">$&</ul>');

    // Convert line breaks to <br>
    html = html.replace(/\n/g, '<br>');

    // Clean up extra spaces
    html = html.replace(/\s+/g, ' ').trim();

    return html;
  }

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
        response.content = this.convertToHtml(response.content);
        return response;
      }),
      catchError(error => {
        console.error('Chat API error:', error);
        return throwError(() => new Error('Failed to get response from Islamic chatbot'));
      })
    );
  }

  getConversations(): Observable<Conversation[]> {
    const user = this.authService.currentUser();
    if (!user) {
      return throwError(() => new Error('User must be authenticated'));
    }

    return this.http.get<Conversation[]>(`${this.API_BASE_URL}/chat/conversations/${user.id}`).pipe(
      catchError(error => {
        console.error('Failed to fetch conversations:', error);
        return throwError(() => new Error('Failed to fetch conversation history'));
      })
    );
  }

  getConversationMessages(conversationId: string): Observable<ChatResponse[]> {
    return this.http.get<ChatResponse[]>(`${this.API_BASE_URL}/chat/conversations/${conversationId}/messages`).pipe(
      catchError(error => {
        console.error('Failed to fetch conversation messages:', error);
        return throwError(() => new Error('Failed to fetch conversation messages'));
      })
    );
  }

  clearConversation(): void {
    this.conversationId = null;
  }

  setConversationId(conversationId: string): void {
    this.conversationId = conversationId;
  }

  deleteConversation(conversationId: string): Observable<{status: string, message: string}> {
    const user = this.authService.currentUser();
    if (!user) {
      return throwError(() => new Error('User must be authenticated'));
    }

    return this.http.delete<{status: string, message: string}>(`${this.API_BASE_URL}/chat/conversations/${conversationId}?user_id=${user.id}`).pipe(
      catchError(error => {
        console.error('Failed to delete conversation:', error);
        return throwError(() => new Error('Failed to delete conversation'));
      })
    );
  }

}
