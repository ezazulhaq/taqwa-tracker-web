import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { ChatRequest, ChatResponse, Conversation } from '../chatbot/chatbot.model';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly API_BASE_URL = environment.apiBaseUrl;
  private conversationId: string | null = null;

  convertToHtml(markdown: string): string {
    if (!markdown) return '';

    try {
      // Import marked and DOMPurify
      // NOTE: Using import inside method if they are not already imported at top level
      // but for better performance and clarity, they should be imported at top level.
      // I will add them to the top of the file in the next step or alongside this.
      const rawHtml = marked.parse(markdown) as string;
      return DOMPurify.sanitize(rawHtml);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      // Fallback to basic text if parsing fails
      return markdown;
    }
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
    return this.http.get<Conversation[]>(`${this.API_BASE_URL}/chat/conversations`).pipe(
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

  deleteConversation(conversationId: string): Observable<{ status: string, message: string }> {
    return this.http.delete<{ status: string, message: string }>(`${this.API_BASE_URL}/chat/conversations/${conversationId}`).pipe(
      catchError(error => {
        console.error('Failed to delete conversation:', error);
        return throwError(() => new Error('Failed to delete conversation'));
      })
    );
  }

  renameConversation(conversationId: string, title: string): Observable<{ status: string, message: string }> {
    return this.http.put<{ status: string, message: string }>(`${this.API_BASE_URL}/chat/conversations/${conversationId}/rename`, { title }).pipe(
      catchError(error => {
        console.error('Failed to rename conversation:', error);
        return throwError(() => new Error('Failed to rename conversation'));
      })
    );
  }

}
