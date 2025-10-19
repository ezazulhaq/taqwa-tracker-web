import { Component, computed, effect, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Tasbih } from '../../../model/tasbih.model';
import { TasbihService } from '../../../service/tasbih.service';
import { TitleComponent } from '../../../shared/title/title.component';

@Component({
  selector: 'app-tasbih',
  imports: [
    CommonModule,
    FormsModule,
    TitleComponent,
  ],
  templateUrl: './tasbih.component.html',
  styleUrl: './tasbih.component.css',
  host: {
    class: 'app-bg'
  }
})
export class TasbihComponent implements OnInit {

  private tasbihService = inject(TasbihService);
  private router = inject(Router);

  tasbihs = signal<Tasbih[]>([]);
  selectedTasbihId = signal<string>('1');
  selectedTasbih = linkedSignal(() => this.tasbihs().find(t => t.id === this.selectedTasbihId()));
  isVibrationEnabled = signal<boolean>(true);
  isCountingComplete = signal<boolean>(false);

  constructor() {
    this.tasbihs.set(this.tasbihService.tasbihList());

    effect(() => {
      this.tasbihs.set(this.tasbihService.tasbihList());
      this.selectedTasbih.set(this.tasbihs().find(t => t.id === this.selectedTasbihId()));
      this.isCountingComplete.set(this.selectedTasbih()!.count >= this.selectedTasbih()!.targetCount);
    });
  }

  ngOnInit(): void {
    // Load user preferences from localStorage
    const vibrationPref = localStorage.getItem('tasbih_vibration');
    this.isVibrationEnabled.set(vibrationPref ? JSON.parse(vibrationPref) : true);
  }

  redirectToHome() {
    this.router.navigate(['/home']);
  }

  onTasbihSelect(id: string): void {
    this.selectedTasbihId.set(id);
  }

  increment(): void {
    if (!this.selectedTasbih()) return;

    this.tasbihService.incrementCount(this.selectedTasbihId());

    // Provide haptic feedback if enabled and available
    if (this.isVibrationEnabled() && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }

    // Check if target count is reached
    if (this.selectedTasbih() && this.selectedTasbih()!.count === this.selectedTasbih()!.targetCount) {
      if (this.isVibrationEnabled() && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  }

  resetCounter(): void {
    if (this.selectedTasbihId()) {
      this.tasbihService.resetCount(this.selectedTasbihId());
    }
  }

  toggleVibration(): void {
    this.isVibrationEnabled.update(value => !value);
    localStorage.setItem('tasbih_vibration', JSON.stringify(this.isVibrationEnabled()));
  }

  getCompletionPercentage(): number {
    if (!this.selectedTasbih() || this.selectedTasbih()!.targetCount === 0) return 0;
    return (this.selectedTasbih()!.count / this.selectedTasbih()!.targetCount) * 100;
  }

}
