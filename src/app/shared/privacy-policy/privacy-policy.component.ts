import { Component } from '@angular/core';

@Component({
    selector: 'app-privacy-policy',
    standalone: true,
    imports: [],
    templateUrl: './privacy-policy.component.html',
    styles: [`
    :host {
      display: block;
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
    }
  `]
})
export class PrivacyPolicyComponent { }
