import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ListHomeComponent } from '../../../../shared/skeleton/list-home/list-home.component';
import { QuranService } from '../quran.service';
import { Juz } from '../quran.model';
import { BookmarkListComponent } from '../../../../shared/bookmark-list/bookmark-list.component';
import { SortButtonComponent } from '../../../../shared/sort-button/sort-button.component';

@Component({
    selector: 'app-juz-list',
    imports: [
        CommonModule,
        RouterLink,
        ListHomeComponent,
        SortButtonComponent,
        BookmarkListComponent
    ],
    templateUrl: './juz-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JuzListComponent implements OnInit {

    private readonly quranService = inject(QuranService);

    private readonly rawJuzList = signal<Juz[]>([]);

    isAscending = signal<boolean>(true);

    juzList = computed(() => {
        const list = [...this.rawJuzList()];
        return list.sort((a, b) => {
            const comparison = a.juz_id - b.juz_id;
            return this.isAscending() ? comparison : -comparison;
        });
    });

    ngOnInit(): void {
        this.loadJuzList();
    }

    private loadJuzList(): void {
        this.quranService.getAllJuz()
            .subscribe(
                {
                    next: (data: any) => {
                        this.rawJuzList.set(data);
                    },
                    error: (error: any) => console.log(error.error),
                    complete: () => {
                        console.log("juz loaded")
                    }
                }
            );
    }

    toggleSort() {
        this.isAscending.update(asc => !asc);
    }
}
