import { Component, ElementRef, ViewChild, signal, inject } from '@angular/core';
import { ChatbotService } from '../service/chatbot.service';
import { AuthService } from '../service/auth.service';
import { FormsModule } from '@angular/forms';
import { ChatbotMessage } from './chatbot.model';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chatbot',
  imports: [
    FormsModule,
    MarkdownModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {

  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  private authService = inject(AuthService);

  isChatbotVisible = signal<boolean>(false);
  isChatbotDialogeVisible = signal<boolean>(true);

  messages = signal<ChatbotMessage[]>([]);
  userMessage = '';

  isChatRequested = signal<boolean>(false);

  constructor(private chatbotService: ChatbotService) { }

  ngOnInit() {

    // AutoClose Dialoge after 10 secs
    setInterval(() => {
      this.isChatbotDialogeVisible.set(false);
    }, 10000);

    // Add initial assistant message
    this.addAssistantMessage("I am an Islamic scholar. Please ask me only questions regarding the Islam and its teachings.");
  }

  sendMessage() {
    if (this.userMessage.trim() === '') return;

    // Check authentication
    if (!this.authService.isAuthenticated()) {
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
    this.addAssistantMessage("I am an Islamic scholar. Please ask me only questions regarding the Islam and its teachings.");
  }

  private addUserMessage(content: string) {
    this.messages.update(messages => [...messages, { role: 'user', content }]);
  }

  private addAssistantMessage(content: string) {
    this.messages.update(messages => [...messages, { role: 'assistant', content }]);
  }

  private scrollToBottom(): void {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight; // Scroll to the bottom
  }

}
