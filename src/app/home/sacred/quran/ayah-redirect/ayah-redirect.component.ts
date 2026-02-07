import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Redirect component for backward compatibility with old /quran/ayah route
 * Redirects to appropriate surah-ayah or juz-ayah route based on query params
 */
@Component({
    selector: 'app-ayah-redirect',
    template: '',
    standalone: true
})
export class AyahRedirectComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            // Check if it's a Juz request or Surah request
            if (params['juzNumber']) {
                // Redirect to juz-ayah with all query params preserved
                this.router.navigate(['/quran/juz-ayah'], {
                    queryParams: {
                        juzNumber: params['juzNumber'],
                        juzName: params['juzName'],
                        juzName_en: params['juzName_en'],
                        ayahNo: params['ayahNo']
                    },
                    queryParamsHandling: 'merge'
                });
            } else if (params['surahNumber']) {
                // Redirect to surah-ayah with all query params preserved
                this.router.navigate(['/quran/surah-ayah'], {
                    queryParams: {
                        surahNumber: params['surahNumber'],
                        surahName: params['surahName'],
                        surahName_ar: params['surahName_ar'],
                        ayahNo: params['ayahNo']
                    },
                    queryParamsHandling: 'merge'
                });
            } else {
                // No valid params, redirect to quran home
                this.router.navigate(['/quran']);
            }
        });
    }
}
