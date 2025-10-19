import { Component, HostListener, effect, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  imports: [],
  templateUrl: './scroll-top.component.html',
  styleUrl: './scroll-top.component.css'
})
export class ScrollTopComponent {

  isVisible = signal<boolean>(false);
  private scrollThreshold = 300; // Show button after scrolling 300px
  private scrollTimeout: any;

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isVisible.set(scrollPosition > this.scrollThreshold);

    // Clear any existing timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Set a new timeout to hide the button after 5 seconds of no scrolling
    this.scrollTimeout = setTimeout(
      () => {
        this.isVisible.set(false);
      },
      2000
    ); // 2000 milliseconds = 2 seconds
  }

  constructor() { }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Clean up the timeout when the component is destroyed
  ngOnDestroy() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

}
