import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { ChatbotService } from '../service/chatbot.service';
import { FormsModule } from '@angular/forms';
import { HadithReference, SearchHadithResponse } from '../model/search-hadith.model';
import { ChatbotMessage } from './chatbot.model';
import { HadithLinksComponent } from './hadith-links/hadith-links.component';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chatbot',
  imports: [
    FormsModule,
    HadithLinksComponent,
    MarkdownModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

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

    this.isChatRequested.set(true);
    this.addUserMessage(this.userMessage);

    this.chatbotService.queryIslam(this.userMessage).subscribe({
      next: (data: SearchHadithResponse) => {
        this.updateLastAssistantMessage(data.summary, data.results);
      },
      error: (error) => {
        console.error('Error:', error);
        this.addAssistantMessage('Sorry, an error occurred.');
      },
      complete: () => {
        this.userMessage = '';
        this.isChatRequested.set(false);
        this.scrollToBottom();
      }
    });
  }

  protected clearChat() {
    this.messages.set([]);
    this.addAssistantMessage("I am an Islamic scholar. Please ask me only questions regarding the Islam and its teachings.");
  }

  private addUserMessage(content: string) {
    this.messages.update(messages => [...messages, { role: 'user', content }]);
  }

  private addAssistantMessage(content: string, links?: HadithReference[]) {
    this.messages.update(messages => [...messages, { role: 'assistant', content, links }]);
  }

  private updateLastAssistantMessage(content: string, links?: HadithReference[]) {
    const lastMessage = this.messages()[this.messages().length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      lastMessage.content = content;
    } else {
      this.addAssistantMessage(content, links);
    }
  }

  private scrollToBottom(): void {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight; // Scroll to the bottom
  }

}
