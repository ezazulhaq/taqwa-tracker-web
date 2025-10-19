import { Injectable } from '@angular/core';

interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RateLimitService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
  private readonly RESET_WINDOW = 60 * 1000; // 1 minute
  private attempts = new Map<string, RateLimitEntry>();

  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    if (!entry) {
      return true;
    }

    // Check if still blocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
      return false;
    }

    // Reset if window expired
    if (now - entry.lastAttempt > this.RESET_WINDOW) {
      this.attempts.delete(identifier);
      return true;
    }

    return entry.attempts < this.MAX_ATTEMPTS;
  }

  recordAttempt(identifier: string, success: boolean): void {
    const now = Date.now();
    const entry = this.attempts.get(identifier) || { attempts: 0, lastAttempt: now };

    if (success) {
      this.attempts.delete(identifier);
      return;
    }

    entry.attempts++;
    entry.lastAttempt = now;

    if (entry.attempts >= this.MAX_ATTEMPTS) {
      entry.blockedUntil = now + this.BLOCK_DURATION;
    }

    this.attempts.set(identifier, entry);
  }

  getRemainingTime(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry?.blockedUntil) return 0;
    
    return Math.max(0, entry.blockedUntil - Date.now());
  }

  getAttemptsLeft(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry) return this.MAX_ATTEMPTS;
    
    return Math.max(0, this.MAX_ATTEMPTS - entry.attempts);
  }
}