import { ChangeDetectionStrategy, Component, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-popup',
    imports: [CommonModule],
    templateUrl: './popup.component.html',
    styleUrl: './popup.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupComponent {
    title = input<string>('');
    showCloseButton = input<boolean>(true);
    showActions = input<boolean>(true);
    closeOnOverlayClick = input<boolean>(true);

    @Output() closed = new EventEmitter<void>();

    isVisible = signal(false);

    show(): void {
        this.isVisible.set(true);
    }

    close(): void {
        this.isVisible.set(false);
        this.closed.emit();
    }

    onOverlayClick(event: Event): void {
        if (this.closeOnOverlayClick()) {
            this.close();
        }
    }
}