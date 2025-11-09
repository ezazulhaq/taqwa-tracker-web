import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.gaurd';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent),
        children: [
            {
                path: 'login',
                title: 'Login',
                loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                title: 'Register',
                loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
            },
            {
                path: 'forgot-password',
                title: 'Forgot Password',
                loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
            },
            {
                path: 'reset-password',
                title: 'Reset Password',
                loadComponent: () => import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
            }
        ]
    },
    {
        path: 'profile',
        title: 'Profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'home',
        title: 'Home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'prayer',
        title: 'Prayer Times',
        loadComponent: () => import('./home/tool/prayer-times/prayer-times.component').then(m => m.PrayerTimesComponent)
    },
    {
        path: 'kaaba',
        title: 'Kaaba',
        loadComponent: () => import('./home/tool/kaaba/kaaba.component').then(m => m.KaabaComponent)
    },
    {
        path: 'quran',
        title: 'Quran',
        loadComponent: () => import('./home/sacred/quran/quran.component').then(m => m.QuranComponent)
    },
    {
        path: 'quran/ayah',
        title: 'Ayah',
        loadComponent: () => import('./home/sacred/quran/ayah/ayah.component').then(m => m.AyahComponent)
    },
    {
        path: 'hadith',
        title: 'Hadith',
        loadComponent: () => import('./home/sacred/hadith/hadith.component').then(m => m.HadithComponent)
    },
    {
        path: 'hadith/chapter',
        title: 'Chapter',
        loadComponent: () => import('./home/sacred/hadith/chapter/chapter.component').then(m => m.ChapterComponent)
    },
    {
        path: 'library',
        title: 'Islamic Library',
        loadComponent: () => import('./home/sacred/library/library.component').then(m => m.LibraryComponent)
    },
    {
        path: 'reader',
        title: 'Library Reader',
        loadComponent: () => import('./home/sacred/library/reader/reader.component').then(m => m.ReaderComponent)
    },
    {
        path: 'feedback',
        title: 'Feedback',
        loadComponent: () => import('./feedback/feedback.component').then(m => m.FeedbackComponent)
    },
    {
        path: 'tasbih',
        title: 'Tasbih Counter',
        loadComponent: () => import('./home/tool/tasbih/tasbih.component').then(m => m.TasbihComponent)
    },
    {
        path: 'calendar',
        title: 'Islamic Calendar',
        loadComponent: () => import('./home/tool/calendar/calendar.component').then(m => m.IslamicCalendarComponent)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'auth/login'
    }
];
