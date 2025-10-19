import { Component, effect, HostListener, inject, OnInit } from '@angular/core';
import { HeaderService } from './header.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  headerService = inject(HeaderService);

  private lastScrollTop = 0;
  private scrollThreshold = 10; // Minimum scroll distance to trigger hide/show
  isHeaderVisible = true;

  ngOnInit() {
    this.lastScrollTop = window.scrollY || document.documentElement.scrollTop;
  }

  @HostListener('window:scroll')
  onScrollMenu() {
    const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

    // Avoid negative values when bouncing scroll on mobile
    if (currentScrollTop < 0) {
      return;
    }

    const scrollDifference = Math.abs(currentScrollTop - this.lastScrollTop);

    // Only trigger if scroll distance is above threshold
    if (scrollDifference > this.scrollThreshold) {
      if (currentScrollTop > this.lastScrollTop) {
        // Scrolling down - hide header
        this.isHeaderVisible = false;
      } else {
        // Scrolling up - show header
        this.isHeaderVisible = true;
      }

      this.lastScrollTop = currentScrollTop;
    }

    // Always show header when at the top of the page
    if (currentScrollTop <= 0) {
      this.isHeaderVisible = true;
    }
  }

  toggleMenu() {
    this.headerService.toggleMenu();
  }

  toggleSettings() {
    this.headerService.toggleSettings();
  }

}