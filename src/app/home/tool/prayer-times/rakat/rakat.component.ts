import { Component, computed, effect, input, output, signal } from '@angular/core';
import { RakatDetailComponent } from './rakat-detail/rakat-detail.component';
import { Rakats } from './rakat.model';
import { rakats } from './rakat.contant';

@Component({
  selector: 'app-rakat',
  imports: [RakatDetailComponent],
  templateUrl: './rakat.component.html',
  styleUrl: './rakat.component.css'
})
export class RakatComponent {

  name = input.required<string>();
  resetName = output<string>();

  getRakat = computed(() => {
    return rakats.find((rakat: Rakats) => rakat.name === this.name())
  });

  constructor() { }

  closeRakatsPopUp() {
    this.resetName.emit("");
  }

}
