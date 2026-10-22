import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-rakat-detail',
  templateUrl: './rakat-detail.component.html',
  styleUrl: './rakat-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RakatDetailComponent {
  label = input<string>();
  value = input<number | string>();
}