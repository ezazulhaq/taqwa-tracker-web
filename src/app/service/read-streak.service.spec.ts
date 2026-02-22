import { TestBed } from '@angular/core/testing';
import { ReadStreakService } from './read-streak.service';
import { ReadItem, StreakStats } from '../home/streak-dashboard/streak-dashboard.model';

describe('ReadStreakService', () => {
  let service: ReadStreakService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    service = TestBed.inject(ReadStreakService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should track read items and update stats', () => {
    const item: ReadItem = {
      type: 'quran',
      title: 'Surah Al-Fatiha',
      subtitle: 'Verse 1',
      link: '/quran/1/1',
      timestamp: new Date().toISOString()
    };

    service.trackRead(1, item);
    const stats = service.getStreakStats();

    expect(stats.totalItemsRead).toBe(1);
    expect(stats.currentStreak).toBe(1);
    expect(stats.readingHistory.length).toBe(1);

    const recent = service.getRecentReadItems();
    expect(recent.length).toBe(1);
    expect(recent[0].title).toBe('Surah Al-Fatiha');
  });

  it('should track library read items and update stats', () => {
    const item: ReadItem = {
      type: 'library',
      title: 'Fortress Of The Muslim',
      subtitle: 'Duas',
      link: '/reader?pdfName=fortress_of_the_muslim.pdf&category=duas&storageKey=fortress',
      timestamp: new Date().toISOString()
    };

    service.trackRead(1, item);
    const stats = service.getStreakStats();

    expect(stats.totalItemsRead).toBe(1);
    expect(stats.currentStreak).toBe(1);

    const recent = service.getRecentReadItems();
    expect(recent.length).toBe(1);
    expect(recent[0].type).toBe('library');
    expect(recent[0].title).toBe('Fortress Of The Muslim');
  });

  it('BENCHMARK: getRecentReadItems performance (Heavy Load)', () => {
    // Setup data - Simulate 90 days of history
    const history: any[] = [];
    for (let i = 0; i < 90; i++) {
      history.push({
        date: `2023-01-${String(i + 1).padStart(2, '0')}`,
        itemsRead: 5,
        recentItems: Array(5).fill({
          type: 'quran',
          title: 'Surah test',
          subtitle: 'Verse ' + i,
          link: '/test',
          timestamp: new Date().toISOString()
        })
      });
    }
    const stats: StreakStats = {
      currentStreak: 10,
      longestStreak: 50,
      totalDaysRead: 100,
      totalItemsRead: 500,
      lastReadDate: '2023-03-30',
      readingHistory: history
    };

    localStorage.setItem('taqwa_tracker_reading_streak', JSON.stringify(stats));
    service.streakStats.set(stats); // Ensure signal has the heavy data for optimized path

    const iterations = 1000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      service.getRecentReadItems(10);
    }

    const end = performance.now();
    const time = end - start;
    console.log(`BENCHMARK: getRecentReadItems (Heavy) x${iterations}: ${time.toFixed(2)}ms`);
    expect(time).toBeGreaterThan(0);
  });

  it('BENCHMARK: trackRead performance (Heavy Load)', () => {
    // Setup initial heavy state
    const history: any[] = [];
    for (let i = 0; i < 90; i++) {
      history.push({
        date: `2023-01-${String(i + 1).padStart(2, '0')}`,
        itemsRead: 5,
        recentItems: Array(5).fill({
          type: 'quran',
          title: 'Surah test',
          subtitle: 'Verse ' + i,
          link: '/test',
          timestamp: new Date().toISOString()
        })
      });
    }
    const stats: StreakStats = {
      currentStreak: 10,
      longestStreak: 50,
      totalDaysRead: 100,
      totalItemsRead: 500,
      lastReadDate: '2023-03-30',
      readingHistory: history
    };
    localStorage.setItem('taqwa_tracker_reading_streak', JSON.stringify(stats));
    service.streakStats.set(stats); // Ensure signal has the heavy data

    const item: ReadItem = {
      type: 'quran',
      title: 'Test',
      subtitle: 'Verse 1',
      link: '/test',
      timestamp: new Date().toISOString()
    };

    const iterations = 100; // Reduced iterations as trackRead is slower
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      service.trackRead(1, item);
    }

    const end = performance.now();
    const time = end - start;
    console.log(`BENCHMARK: trackRead (Heavy) x${iterations}: ${time.toFixed(2)}ms`);
    expect(time).toBeGreaterThan(0);
  });
});
