import { Component, computed, inject, ViewChild } from '@angular/core';
import { ReadStreakService } from '../../service/read-streak.service';
import { Router } from '@angular/router';
import { ReadItem } from './streak-dashboard.model';
import { ItemIconPipe } from './item-icon.pipe';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-streak-dashboard',
  imports: [ItemIconPipe, ConfirmDialogComponent],
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

    const [year, month, day] = lastRead.split('-');
    const lastReadDate = new Date(Number(year), Number(month) - 1, Number(day));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  resetStreak(): void {
    this.confirmDialog.show();
  }

  onConfirmReset(): void {
    this.readStreakService.resetStreak();
  }

  navigateToRead(item: ReadItem): void {
    this.router.navigateByUrl(item.link);
  }

}
