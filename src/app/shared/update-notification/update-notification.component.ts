import { Component, output, ChangeDetectionStrategy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-update-notification',
    imports: [],
    templateUrl: './update-notification.component.html',
    styleUrl: './update-notification.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('slideDown', [
            state('void', style({
                transform: 'translateY(-100%)',
                opacity: 0
            })),
            state('*', style({
                transform: 'translateY(0)',
                opacity: 1
            })),
            transition('void => *', animate('400ms cubic-bezier(0.4, 0, 0.2, 1)')),
            transition('* => void', animate('300ms cubic-bezier(0.4, 0, 1, 1)'))
        ])
    ]
})
export class UpdateNotificationComponent {
    updateNow = output<void>();
    dismiss = output<void>();

    onUpdateClick(): void {
        this.updateNow.emit();
    }

    onDismissClick(): void {
        this.dismiss.emit();
    }
}
