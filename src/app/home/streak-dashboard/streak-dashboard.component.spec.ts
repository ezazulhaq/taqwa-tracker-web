import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StreakDashboardComponent } from './streak-dashboard.component';
import { ReadStreakService } from '../../service/read-streak.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

describe('StreakDashboardComponent', () => {
  let component: StreakDashboardComponent;
  let fixture: ComponentFixture<StreakDashboardComponent>;

  const mockReadStreakService = {
    streakStats: signal({
      currentStreak: 5,
      longestStreak: 10,
      totalDaysRead: 20,
      totalItemsRead: 50,
      lastReadDate: '2023-10-26',
      readingHistory: []
    }),
    getRecentReadItems: (limit: number) => [
      { type: 'quran', title: 'Surah Al-Fatiha', link: '/quran/1', timestamp: '2023-10-26T10:00:00Z' },
      { type: 'hadith', title: 'Sahih Bukhari 1', link: '/hadith/1', timestamp: '2023-10-26T10:00:00Z' },
      { type: 'library', title: 'Fortress Of The Muslim', link: '/reader?pdfName=fortress.pdf', timestamp: '2023-10-26T10:00:00Z' }
    ],
    resetStreak: jasmine.createSpy('resetStreak')
  };

  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreakDashboardComponent],
      providers: [
        { provide: ReadStreakService, useValue: mockReadStreakService },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StreakDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct icons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Check if icons are rendered
    // Note: The text content might be spread out, so checking for specific characters is safer.
    const textContent = compiled.textContent || '';
    expect(textContent).toContain('📖');
    expect(textContent).toContain('📚');
    expect(textContent).toContain('📄');
  });
});
