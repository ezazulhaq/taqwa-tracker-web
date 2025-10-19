import { Injectable } from '@angular/core';
import { CaptchaChallenge, CaptchaResponse } from '../model/captcha.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  private currentChallenge = new BehaviorSubject<CaptchaChallenge | null>(null);
  public currentChallenge$ = this.currentChallenge.asObservable();

  constructor(private http: HttpClient) { }

  // Generate a simple math-based CAPTCHA
  generateMathChallenge(): CaptchaChallenge {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let answer: number;
    let question: string;

    switch (operation) {
      case '+':
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        break;
      case '-':
        // Ensure positive result
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        answer = larger - smaller;
        question = `${larger} - ${smaller} = ?`;
        break;
      case '×':
        answer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
        break;
      default:
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
    }

    const challenge: CaptchaChallenge = {
      id: this.generateId(),
      imageUrl: this.generateCaptchaImage(question),
      question: question
    };

    // Store the answer securely (in a real app, this would be server-side)
    sessionStorage.setItem(`captcha_${challenge.id}`, answer.toString());

    this.currentChallenge.next(challenge);
    return challenge;
  }

  // Generate a simple text-based image CAPTCHA
  generateTextChallenge(): CaptchaChallenge {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
    let text = '';

    for (let i = 0; i < 5; i++) {
      text += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const challenge: CaptchaChallenge = {
      id: this.generateId(),
      imageUrl: this.generateCaptchaImage(text, true),
      question: 'Enter the text shown in the image'
    };

    // Store the answer securely
    sessionStorage.setItem(`captcha_${challenge.id}`, text);

    this.currentChallenge.next(challenge);
    return challenge;
  }

  // Verify CAPTCHA answer
  verifyCaptcha(response: CaptchaResponse): boolean {
    const storedAnswer = sessionStorage.getItem(`captcha_${response.challengeId}`);

    if (!storedAnswer) {
      return false;
    }

    // Clean up
    sessionStorage.removeItem(`captcha_${response.challengeId}`);

    // Case-insensitive comparison for text challenges
    return storedAnswer.toLowerCase() === response.answer.toLowerCase();
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Generate CAPTCHA image as base64 data URL
  private generateCaptchaImage(text: string, isTextChallenge = false): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = 200;
    canvas.height = 80;

    // Background with noise
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise dots
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 70%)`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2, 2
      );
    }

    // Add noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `hsl(${Math.random() * 360}, 50%, 60%)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw text
    if (isTextChallenge) {
      // Distorted text for text challenges
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const letters = text.split('');
      letters.forEach((letter, index) => {
        ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 30%)`;
        ctx.save();

        const x = 40 + (index * 25);
        const y = 40 + (Math.random() * 10 - 5);
        const rotation = (Math.random() * 30 - 15) * Math.PI / 180;

        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillText(letter, 0, 0);
        ctx.restore();
      });
    } else {
      // Clean text for math challenges
      ctx.fillStyle = '#333';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }

    return canvas.toDataURL();
  }

  // Refresh current challenge
  refreshChallenge(type: 'math' | 'text' = 'math'): CaptchaChallenge {
    return type === 'math' ? this.generateMathChallenge() : this.generateTextChallenge();
  }
}
