import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TitleComponent } from '../../../shared/title/title.component';
import { AuthService } from '../../../service/auth.service';

@Component({
    selector: 'app-quran',
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        TitleComponent
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

    redirectToHome() {
        this.router.navigate(['/home']);
    }
}
