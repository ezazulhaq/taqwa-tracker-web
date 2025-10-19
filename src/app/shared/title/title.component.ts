import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-title',
  imports: [],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css'
})
export class TitleComponent {

  private router = inject(Router);

  title = input.required<string>();
  subTitle = input<string>();
  routerLink = input<string>();

  redirectToHome(path: string | undefined) {
    if (path === undefined || !path) return;

    this.router.navigate([`${path}`]);
  }
}
