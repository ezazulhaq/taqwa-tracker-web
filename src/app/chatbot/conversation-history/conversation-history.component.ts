import { ChangeDetectionStrategy, Component, signal, output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Conversation } from '../chatbot.model';

@Component({
    selector: 'app-conversation-history',
    imports: [FormsModule, DatePipe],
    templateUrl: './conversation-history.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationHistoryComponent {
    conversations = input.required<Conversation[]>();
    deletingConversationId = input<string | null>(null);

    loadConversation = output<string>();
    deleteConversation = output<{ id: string, event: Event }>();
    startEditingTitle = output<{ id: string, title: string, event: Event }>();
    saveTitle = output<{ id: string, title: string, event: Event }>();
    newChat = output<void>();

    editingConversationId = signal<string | null>(null);
    editingTitle = signal<string>('');

    onNewChat() {
        this.newChat.emit();
    }

    onLoadConversation(id: string) {
        this.loadConversation.emit(id);
    }

    onDeleteConversation(id: string, event: Event) {
        this.deleteConversation.emit({ id, event });
    }

    onStartEditingTitle(id: string, title: string, event: Event) {
        event.stopPropagation();
        this.editingConversationId.set(id);
        this.editingTitle.set(title);
        this.startEditingTitle.emit({ id, title, event });
    }

    onSaveTitle(id: string, event: Event) {
        if (event instanceof KeyboardEvent && event.key !== 'Enter') return;
        event.stopPropagation();
        this.saveTitle.emit({ id, title: this.editingTitle(), event });
        this.editingConversationId.set(null);
    }

    cancelEdit() {
        this.editingConversationId.set(null);
    }
}
