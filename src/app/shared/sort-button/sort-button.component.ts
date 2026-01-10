import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sort-button',
    imports: [CommonModule],
    templateUrl: './sort-button.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortButtonComponent {
    isAscending = input.required<boolean>();
    toggle = output<void>();
}
