import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './guard/auth.gaurd';
import { ProfileComponent } from './profile/profile.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ChapterComponent } from './home/sacred/hadith/chapter/chapter.component';
import { HadithComponent } from './home/sacred/hadith/hadith.component';
import { LibraryComponent } from './home/sacred/library/library.component';
import { ReaderComponent } from './home/sacred/library/reader/reader.component';
import { AyahComponent } from './home/sacred/quran/ayah/ayah.component';
import { QuranComponent } from './home/sacred/quran/quran.component';
import { KaabaComponent } from './home/tool/kaaba/kaaba.component';
import { PrayerTimesComponent } from './home/tool/prayer-times/prayer-times.component';
import { TasbihComponent } from './home/tool/tasbih/tasbih.component';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            {
                path: 'login',
                title: 'Login',
                component: LoginComponent
            },
            {
                path: 'register',
                title: 'Register',
                component: RegisterComponent
            },
            {
                path: 'forgot-password',
                title: 'Forgot Password',
                component: ForgotPasswordComponent
            },
            {
                path: 'reset-password',
                title: 'Reset Password',
                component: ResetPasswordComponent
            }
        ]
    },
    {
        path: 'profile',
        title: 'Profile',
        component: ProfileComponent,
        canActivate: [
            authGuard
        ]
    },
    {
        path: 'home',
        title: 'Home',
        component: HomeComponent
    },
    {
        path: 'prayer',
        title: 'Prayer Times',
        component: PrayerTimesComponent
    },
    {
        path: 'kaaba',
        title: 'Kaaba',
        component: KaabaComponent
    },
    {
        path: 'quran',
        title: 'Quran',
        component: QuranComponent
    },
    {
        path: 'quran/ayah',
        title: 'Ayah',
        component: AyahComponent
    },
    {
        path: 'hadith',
        title: 'Hadith',
        component: HadithComponent
    },
    {
        path: 'hadith/chapter',
        title: 'Chapter',
        component: ChapterComponent
    },
    {
        path: 'library',
        title: 'Islamic Library',
        component: LibraryComponent
    },
    {
        path: 'reader',
        title: 'Library Reader',
        component: ReaderComponent
    },
    {
        path: 'feedback',
        title: 'Feedback',
        component: FeedbackComponent
    },
    {
        path: 'tasbih',
        title: 'Tasbih Counter',
        component: TasbihComponent
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
