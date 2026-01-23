import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-chatbot-toggle',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './chatbot-toggle.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotToggleComponent { }
