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
        path: 'apps',
        title: 'All Apps',
        loadComponent: () => import('./home/all-apps/all-apps.component').then(m => m.AllAppsComponent)
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
        loadComponent: () => import('./home/sacred/quran/quran.component').then(m => m.QuranComponent),
        children: [
            {
                path: 'surah',
                title: 'Surah List',
                loadComponent: () => import('./home/sacred/quran/surah-list/surah-list.component').then(m => m.SurahListComponent)
            },
            {
                path: 'juz',
                title: 'Juz List',
                loadComponent: () => import('./home/sacred/quran/juz-list/juz-list.component').then(m => m.JuzListComponent)
            },
            {
                path: '',
                redirectTo: 'surah',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'quran/surah-ayah',
        title: 'Surah',
        loadComponent: () => import('./home/sacred/quran/surah-ayah/surah-ayah.component').then(m => m.SurahAyahComponent)
    },
    {
        path: 'quran/juz-ayah',
        title: 'Juz',
        loadComponent: () => import('./home/sacred/quran/juz-ayah/juz-ayah.component').then(m => m.JuzAyahComponent)
    },
    {
        path: 'quran/ayah',
        title: 'Redirecting...',
        loadComponent: () => import('./home/sacred/quran/ayah-redirect/ayah-redirect.component').then(m => m.AyahRedirectComponent)
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
        path: 'calculator',
        title: 'Zakat Calculator',
        loadComponent: () => import('./home/tool/calculator/calculator.component').then(m => m.CalculatorComponent)
    },
    {
        path: 'calculator/contributions',
        title: 'Zakat Contribution Tracker',
        loadComponent: () => import('./home/tool/calculator/contribution-tracker/contribution-tracker.component').then(m => m.ContributionTrackerComponent),
        canActivate: [authGuard]
    },
    {
        path: 'games/quiz',
        title: 'Islamic Quiz Challenge',
        loadComponent: () => import('./home/games/quiz/quiz.component').then(m => m.QuizComponent)
    },
    {
        path: 'games/memory',
        title: '99 Names Memory Match',
        loadComponent: () => import('./home/games/memory/memory.component').then(m => m.MemoryComponent)
    },
    {
        path: 'games/word-search',
        title: 'Arabic Word Search',
        loadComponent: () => import('./home/games/word-search/word-search.component').then(m => m.WordSearchComponent)
    },
    {
        path: 'games/journey',
        title: 'Prophet\'s Journey',
        loadComponent: () => import('./home/games/journey/journey.component').then(m => m.JourneyComponent)
    },
    {
        path: 'games/salah-master',
        title: 'Salah Master',
        loadComponent: () => import('./home/games/salah-master/salah-master.component').then(m => m.SalahMasterComponent)
    },
    {
        path: 'chatbot',
        title: 'Islamic Guidance',
        loadComponent: () => import('./chatbot/chatbot.component').then(m => m.ChatbotComponent)
    },
    {
        path: 'privacy-policy',
        title: 'Privacy Policy',
        loadComponent: () => import('./shared/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
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
