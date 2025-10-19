import { Component, input } from '@angular/core';

@Component({
  selector: 'app-rakat-detail',
  templateUrl: './rakat-detail.component.html',
  styleUrl: './rakat-detail.component.css',
})
export class RakatDetailComponent {
  label = input<string>();
  value = input<number | string>();
}