import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TitleComponent } from '../../../shared/title/title.component';
import { AuthService } from '../../../service/auth.service';
import { QuranService } from './quran.service';
import { Ayah } from './quran.model';
import { SearchComponent } from './search/search.component';

@Component({
    selector: 'app-quran',
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        TitleComponent,
        SearchComponent
    ],
    templateUrl: './quran.component.html',
    styleUrl: './quran.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'app-bg'
    }
})
export class QuranComponent {

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly quranService = inject(QuranService);

    isSearchOpen = signal<boolean>(false);

    redirectToHome() {
        this.router.navigate(['/home']);
    }

    openSearch() {
        this.isSearchOpen.set(true);
    }

    closeSearch() {
        this.isSearchOpen.set(false);
    }
}
