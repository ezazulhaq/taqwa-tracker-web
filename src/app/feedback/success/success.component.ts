import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {

  success= input.required<boolean>();
  successChange = output<boolean>();

  anotherRequest() {
    this.successChange.emit(!this.success);
  }
}
