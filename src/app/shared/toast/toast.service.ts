import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    /**
     * Show a toast message
     * @param message Message to display
     * @param type Type of toast (success, error)
     * @param duration Duration in milliseconds
     */
    show(message: string, type: 'success' | 'error' = 'success', duration: number = 3000) {
        const toast = document.createElement('div');

        // Base styles
        const baseClasses = 'fixed top-4 right-4 px-6 py-3 rounded-xl shadow-2xl z-[100] transition-all duration-300 transform translate-y-0 opacity-100 font-medium flex items-center gap-2 max-w-[90vw] md:max-w-md';

        // Type specific styles
        const typeClasses = type === 'success'
            ? 'bg-emerald-600 text-white border border-emerald-500'
            : 'bg-rose-600 text-white border border-rose-500';

        toast.className = `${baseClasses} ${typeClasses}`;

        // Simple icon
        const icon = type === 'success'
            ? `<svg class="size-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
            : `<svg class="size-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

        toast.innerHTML = `
      ${icon}
      <span class="truncate">${message}</span>
    `;

        document.body.appendChild(toast);

        // Subtle entrance animation
        toast.style.transform = 'translateY(-20px)';
        toast.style.opacity = '0';

        // Trigger reflow
        toast.offsetHeight;

        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';

        // Fade out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
}
