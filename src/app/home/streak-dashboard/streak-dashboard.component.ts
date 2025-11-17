import { Component, computed, inject } from '@angular/core';
import { ReadStreakService } from '../../service/read-streak.service';
import { Router } from '@angular/router';
import { ReadItem } from './streak-dashboard.model';

@Component({
  selector: 'app-streak-dashboard',
  imports: [],
  templateUrl: './streak-dashboard.component.html',
  styleUrl: './streak-dashboard.component.css',
})
export class StreakDashboardComponent {

  private readonly readStreakService = inject(ReadStreakService);
  private readonly router = inject(Router);

  streakStats = computed(() => this.readStreakService.streakStats());
  recentReads = computed(() => this.readStreakService.getRecentReadItems(5));

  formatLastReadDate(): string {
    const lastRead = this.streakStats().lastReadDate;
    if (!lastRead) return 'Never';

    const lastReadDate = new Date(lastRead);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastReadDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastReadDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }

  getMotivationalMessage(): string {
    const streak = this.streakStats().currentStreak;

    if (streak === 0) {
      return "Start your reading journey today! 📖";
    } else if (streak === 1) {
      return "Great start! Come back tomorrow to build your streak! 🌟";
    } else if (streak < 7) {
      return `${streak} days strong! Keep going! 💪`;
    } else if (streak < 30) {
      return `Amazing ${streak}-day streak! You're building a great habit! 🎯`;
    } else if (streak < 100) {
      return `Incredible ${streak}-day streak! Your dedication is inspiring! 🏆`;
    } else {
      return `Legendary ${streak}-day streak! May Allah reward your consistency! ✨`;
    }
  }

  resetStreak(): void {
    if (confirm('Are you sure you want to reset your reading streak? This cannot be undone.')) {
      this.readStreakService.resetStreak();
    }
  }

  navigateToRead(item: ReadItem): void {
    this.router.navigateByUrl(item.link);
  }

  getItemIcon(type: string): string {
    return type === 'quran' ? '📖' : '📚';
  }

}
