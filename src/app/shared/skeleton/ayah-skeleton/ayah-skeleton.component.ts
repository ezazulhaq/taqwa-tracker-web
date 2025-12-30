import { Component, input } from '@angular/core';

@Component({
    selector: 'app-ayah-skeleton',
    standalone: true,
    imports: [],
    templateUrl: './ayah-skeleton.component.html',
    styleUrl: './ayah-skeleton.component.css'
})
export class AyahSkeletonComponent {
    isTranslationVisible = input<boolean>(true);
}
