import { Component, ElementRef, ViewChild, signal, inject, computed, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { ChatbotService } from '../service/chatbot.service';
import { Conversation, ChatbotMessage } from './chatbot.model';
import { AuthService } from '../service/auth.service';
import { FormsModule } from '@angular/forms';
import { TitleComponent } from '../shared/title/title.component';
import { ConversationHistoryComponent } from './conversation-history/conversation-history.component';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';

@Component({
  selector: 'app-chatbot',
  imports: [
    FormsModule,
    TitleComponent,
    ConversationHistoryComponent,
    ChatMessagesComponent
  ],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-bg'
  }
})
export class ChatbotComponent {

  @ViewChild(ChatMessagesComponent) private chatMessagesComponent!: ChatMessagesComponent;
  private authService = inject(AuthService);

  isChatbotVisible = signal<boolean>(true);
  isChatbotDialogeVisible = signal<boolean>(false);
  isConversationMenuVisible = signal<boolean>(false);

  messages = signal<ChatbotMessage[]>([]);
  conversations = signal<Conversation[]>([]);
  userMessage = '';

  isChatRequested = signal<boolean>(false);
  deletingConversationId = signal<string | null>(null);

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor(
    private chatbotService: ChatbotService
  ) { }

  ngOnInit() {
    // AutoClose Dialoge after 10 secs
    setInterval(() => {
      this.isChatbotDialogeVisible.set(false);
    }, 10000);
  }

  sendMessage() {
    if (this.userMessage.trim() === '') return;

    // Check authentication
    if (!this.isAuthenticated()) {
      this.addAssistantMessage('Please log in to use the Islamic chatbot.');
      return;
    }

    const message = this.userMessage;
    this.isChatRequested.set(true);
    this.addUserMessage(message);
    this.userMessage = '';

    this.chatbotService.queryIslam(message).subscribe({
      next: (response) => {
        this.addAssistantMessage(response.content);
      },
      error: (error) => {
        console.error('Error:', error);
        this.addAssistantMessage('Sorry, an error occurred. Please try again.');
      },
      complete: () => {
        this.isChatRequested.set(false);
        this.scrollToBottom();
      }
    });
  }

  protected clearChat() {
    this.messages.set([]);
    this.chatbotService.clearConversation();
  }

  protected toggleConversationMenu() {
    this.isConversationMenuVisible.update(visible => !visible);
    if (this.isConversationMenuVisible() && this.isAuthenticated()) {
      this.loadConversations();
    }
  }

  private loadConversations() {
    this.chatbotService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations.set(conversations);
      },
      error: (error) => {
        console.error('Failed to load conversations:', error);
      }
    });
  }

  protected loadConversationMessages(conversationId: string) {
    this.chatbotService.getConversationMessages(conversationId).subscribe({
      next: (messages) => {
        const chatMessages: ChatbotMessage[] = messages.map(msg => ({
          role: msg.role,
          content: msg.role === 'assistant' ? this.chatbotService.convertToHtml(msg.content) : msg.content
        }));
        this.messages.set(chatMessages);
        this.chatbotService.setConversationId(conversationId);
        this.isConversationMenuVisible.set(false);
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Failed to load conversation messages:', error);
      }
    });
  }

  protected deleteConversation(conversationId: string, event: Event) {
    event.stopPropagation();
    this.deletingConversationId.set(conversationId);
    this.chatbotService.deleteConversation(conversationId).subscribe({
      next: () => {
        this.loadConversations();
        this.deletingConversationId.set(null);
      },
      error: (error) => {
        console.error('Failed to delete conversation:', error);
        this.deletingConversationId.set(null);
      }
    });
  }

  protected handleTitleEdit(data: { id: string, title: string, event: Event }) {
    // Placeholder for title editing - handled by child component
  }

  protected handleSaveTitle(data: { id: string, title: string, event: Event }) {
    this.chatbotService.renameConversation(data.id, data.title).subscribe({
      next: () => {
        this.loadConversations();
      },
      error: (error) => {
        console.error('Failed to rename conversation:', error);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.conversation-menu') && this.isConversationMenuVisible()) {
      this.isConversationMenuVisible.set(false);
    }
  }

  private addUserMessage(content: string) {
    this.messages.update(messages => [...messages, { role: 'user', content }]);
  }

  private addAssistantMessage(content: string) {
    this.messages.update(messages => [...messages, { role: 'assistant', content }]);
  }

  private scrollToBottom(): void {
    this.chatMessagesComponent?.scrollToBottom();
  }

}
