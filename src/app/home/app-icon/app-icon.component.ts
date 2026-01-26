import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-icon',
  imports: [RouterLink],
  templateUrl: './app-icon.component.html',
  styleUrl: './app-icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppIconComponent {
  title = input.required<string>();
  link = input.required<string | any[]>();
  path = input.required<string>();
  viewBox = input<string>('0 0 512 512');
  color = input<string>();
}
