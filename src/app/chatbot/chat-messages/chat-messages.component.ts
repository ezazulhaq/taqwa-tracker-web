import { ChangeDetectionStrategy, Component, input, ElementRef, viewChild, effect } from '@angular/core';
import { ChatbotMessage } from '../chatbot.model';

@Component({
    selector: 'app-chat-messages',
    imports: [],
    templateUrl: './chat-messages.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessagesComponent {
    messages = input.required<ChatbotMessage[]>();

    chatContainer = viewChild<ElementRef>('chatContainer');

    constructor() {
        // Auto-scroll when messages change
        effect(() => {
            const msgs = this.messages();
            if (msgs.length > 0) {
                setTimeout(() => this.scrollToBottom(), 100);
            }
        });
    }

    scrollToBottom(): void {
        const container = this.chatContainer()?.nativeElement;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }
}
