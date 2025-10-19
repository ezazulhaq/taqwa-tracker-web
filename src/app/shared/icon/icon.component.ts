import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-icon',
  imports: [
    RouterLink,
    TitleCasePipe
  ],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class IconComponent {

  link = input.required<string>();
  viewBox = input.required<string>();
  path = input.required<string>();
  title = input.required<string>();
  isVisible = input<boolean>();

}
