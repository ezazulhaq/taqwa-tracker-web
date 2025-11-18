# Taqwa Tracker: Islamic Prayer and Hadith Companion

The Taqwa Tracker is a comprehensive Islamic application that provides prayer times, Qibla direction, Quran translations, Hadith search, Islamic chatbot, and more. This Angular 19-based Progressive Web App (PWA) offers a rich set of features for Muslims to enhance their daily religious practices.

The Taqwa Tracker combines modern web technologies with traditional Islamic resources to create a user-friendly and informative platform. It utilizes geolocation for accurate prayer times, integrates with Supabase for data management, implements AI-powered Islamic chatbot, and provides offline functionality through service workers.

## Repository Structure

```
taqwa-tracker-web/
├── docs/
│   └── edge_functions/
│       └── islamic_chatbot.md
├── public/
│   ├── fonts/
│   │   ├── AlQuran-IndoPak-by-QuranWBW.v.4.2.2.ttf
│   │   ├── AlQuran-IndoPak-by-QuranWBW.v.4.2.2.woff
│   │   └── AlQuran-IndoPak-by-QuranWBW.v.4.2.2.woff2
│   ├── icons/
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   ├── icon-512x512.png
│   │   ├── icon-72x72.png
│   │   └── icon-96x96.png
│   ├── favicon.ico
│   ├── icon.png
│   └── manifest.webmanifest
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── reset-password/
│   │   │   └── auth.component.*
│   │   ├── chatbot/
│   │   │   ├── hadith-links/
│   │   │   ├── chatbot.component.*
│   │   │   └── chatbot.model.ts
│   │   ├── config/
│   │   │   └── security.config.ts
│   │   ├── feedback/
│   │   │   ├── success/
│   │   │   └── feedback.component.*
│   │   ├── guard/
│   │   │   └── auth.gaurd.ts
│   │   ├── header/
│   │   │   ├── menu/
│   │   │   ├── settings/
│   │   │   ├── header.component.*
│   │   │   └── header.service.ts
│   │   ├── home/
│   │   │   ├── sacred/
│   │   │   │   ├── hadith/
│   │   │   │   │   └── chapter/
│   │   │   │   ├── library/
│   │   │   │   │   └── reader/
│   │   │   │   └── quran/
│   │   │   │       └── ayah/
│   │   │   ├── streak-dashboard/
│   │   │   ├── tool/
│   │   │   │   ├── calculator/
│   │   │   │   ├── calendar/
│   │   │   │   ├── kaaba/
│   │   │   │   ├── prayer-times/
│   │   │   │   │   └── rakat/
│   │   │   │   │       └── rakat-detail/
│   │   │   │   └── tasbih/
│   │   │   ├── welcome/
│   │   │   └── home.component.*
│   │   ├── interceptor/
│   │   │   └── auth.interceptor.ts
│   │   ├── mobile/
│   │   │   └── menu/
│   │   ├── model/
│   │   │   ├── auth.model.ts
│   │   │   ├── captcha.model.ts
│   │   │   ├── feedback.model.ts
│   │   │   ├── home.model.ts
│   │   │   ├── islamic-library.model.ts
│   │   │   ├── namaz-time.model.ts
│   │   │   ├── open-stream-map.model.ts
│   │   │   ├── search-hadith.model.ts
│   │   │   ├── supabase.model.ts
│   │   │   ├── surah.model.ts
│   │   │   ├── tasbih.model.ts
│   │   │   └── translation.model.ts
│   │   ├── pipes/
│   │   │   └── replace-underline.pipe.ts
│   │   ├── profile/
│   │   │   └── profile.component.*
│   │   ├── service/
│   │   │   ├── auth.service.ts
│   │   │   ├── auto-update.service.ts
│   │   │   ├── bookmark.service.ts
│   │   │   ├── captcha.service.ts
│   │   │   ├── chatbot.service.ts
│   │   │   ├── feedback.service.ts
│   │   │   ├── https-redirect.service.ts
│   │   │   ├── library.service.ts
│   │   │   ├── rate-limit.service.ts
│   │   │   ├── read-streak.service.ts
│   │   │   ├── salah-app.service.ts
│   │   │   ├── sanitization.service.ts
│   │   │   ├── security-headers.service.ts
│   │   │   ├── supabase.service.ts
│   │   │   ├── tasbih.service.ts
│   │   │   └── theme.service.ts
│   │   ├── shared/
│   │   │   ├── calendar/
│   │   │   ├── captcha/
│   │   │   ├── icon/
│   │   │   ├── module/
│   │   │   ├── pdf-viewer/
│   │   │   ├── scroll-top/
│   │   │   ├── skeleton/
│   │   │   │   └── list-home/
│   │   │   └── title/
│   │   ├── app.component.*
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.prod.ts
│   │   └── environment.ts
│   ├── env.d.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── .env
├── angular.json
├── ngsw-config.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.spec.json
```

### Key Files:
- `src/main.ts`: Entry point of the application
- `src/app/app.config.ts`: Application configuration with providers
- `src/app/app.routes.ts`: Application routing configuration
- `src/environments/environment.ts`: Environment-specific configuration with ngx-env
- `angular.json`: Angular CLI configuration (project name: taqwa-tracker)
- `ngsw-config.json`: Service Worker configuration for PWA features
- `public/manifest.webmanifest`: PWA manifest configuration

### Important Integration Points:
- **Supabase**: Authentication, data storage, and edge functions (`src/app/service/supabase.service.ts`, `src/app/service/auth.service.ts`)
- **OpenStreetMap API**: Location services and address resolution (`src/app/service/salah-app.service.ts`)
- **Adhan.js**: Prayer time calculations and Qibla direction (`src/app/service/salah-app.service.ts`)
- **AI Chatbot**: Islamic chatbot using Supabase Edge Functions with Pinecone and Groq AI
- **ngx-markdown**: Markdown rendering for chatbot responses
- **ng2-pdf-viewer**: PDF viewing for Islamic library documents

## Usage Instructions

### Installation

Prerequisites:
- Node.js (v18 or later)
- npm (v8 or later)
- Angular CLI (v19 or later)

Steps:
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd salah-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Getting Started

To run the application in development mode:

```
npm start
```

This will start the development server, typically at `http://localhost:4200`.

### Configuration

The application uses `@ngx-env/core` for environment variable management. Create a `.env` file in the root directory:

```bash
# Required Environment Variables
NG_APP_S3_BUCKET=your-s3-bucket-name
NG_APP_OPEN_STREET_URL=https://nominatim.openstreetmap.org
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

Environment files structure:
- `src/environments/environment.ts`: Development configuration
- `src/environments/environment.prod.ts`: Production configuration

Both files use `import.meta.env` to access environment variables at build time.

### Building for Production

To build the application for production:

```bash
npm run build
```

This will generate a production-ready build in the `dist/taqwa-tracker` directory with:
- Service Worker enabled for offline functionality
- Optimized bundles with tree-shaking
- Environment variables injected at build time

### Testing

To run the unit tests:

```
npm test
```

### Troubleshooting

1. **Location Services Not Working**
   - Problem: Prayer times or Qibla direction not displaying correctly
   - Solution: 
     - Check if location permissions are enabled in your browser
     - Ensure you're connected to the internet
     - Check the browser console for specific error messages

2. **Authentication Issues**
   - Problem: Unable to login or access protected features
   - Solution:
     - Verify Supabase configuration in environment variables
     - Check if email confirmation is required
     - Clear browser storage and try again

3. **Chatbot Not Responding**
   - Problem: Islamic chatbot not providing responses
   - Solution:
     - Ensure Supabase Edge Functions are deployed
     - Check if required API keys (Pinecone, Google AI, Groq) are configured
     - Verify network connectivity

4. **Offline Mode Issues**
   - Problem: App not working properly when offline
   - Solution:
     - Visit the app while online first to cache resources
     - Check if your browser supports Service Workers
     - Clear app cache if experiencing stale data

5. **Build Errors**
   - Problem: Application fails to build
   - Solution:
     - Ensure all environment variables are set
     - Check Angular and Node.js versions compatibility
     - Clear node_modules and reinstall dependencies

For persistent issues, check the browser's developer console for detailed error messages.

## Features

### Core Features
- **Prayer Times**: Accurate prayer times based on user location using Adhan.js
- **Qibla Direction**: Real-time Kaaba direction with compass visualization
- **Quran Reader**: Complete Quran with multiple translations and audio
- **Hadith Search**: Searchable hadith database with chapter navigation
- **Islamic Library**: PDF reader for Islamic books and resources
- **Tasbih Counter**: Digital prayer counter with customizable dhikr

### Advanced Features
- **AI Islamic Chatbot**: Intelligent chatbot powered by Supabase Edge Functions
  - Vector-based hadith search using Pinecone
  - AI-generated responses using Groq (Llama 3.1)
  - Source attribution with hadith references
- **User Authentication**: Complete auth system with Supabase
  - Registration, login, password reset
  - Protected routes with auth guards
  - User profiles and preferences
- **Progressive Web App**: Full PWA capabilities
  - Offline functionality with service workers
  - Install on mobile devices
  - Push notifications support

### Technical Features
- **Responsive Design**: Tailwind CSS for mobile-first design
- **Real-time Updates**: RxJS observables for reactive programming
- **State Management**: Angular signals for efficient state updates
- **Security**: HTTP interceptors, auth guards, and input sanitization
- **Performance**: Lazy loading, code splitting, and optimized bundles

## Deployment

### Prerequisites
- A web server capable of serving static files (e.g., Nginx, Apache)
- SSL certificate for HTTPS (required for PWA features)

### Deployment Steps
1. Build the application for production:
   ```
   npm run build
   ```
2. Copy the contents of the `dist/salah-app` directory to your web server's public directory.
3. Configure your web server to redirect all requests to `index.html` for proper routing.
4. Ensure your server is set up to serve the application over HTTPS.

### Environment Configurations
Update the `src/environments/environment.prod.ts` file with production-specific values before building.

### Monitoring Setup
- Use Angular's built-in error handling to log errors to a monitoring service.
- Implement application performance monitoring (APM) tools to track user interactions and app performance.

## Architecture

### Frontend Architecture
- **Framework**: Angular 19 with standalone components
- **Styling**: Tailwind CSS with custom themes
- **State Management**: Angular signals and RxJS observables
- **Routing**: Angular Router with lazy loading and guards
- **PWA**: Angular Service Worker with custom caching strategies

### Backend Services
- **Database**: Supabase (PostgreSQL) for user data and Islamic content
- **Authentication**: Supabase Auth with JWT tokens
- **Edge Functions**: Supabase Edge Functions for AI chatbot
- **Vector Database**: Pinecone for semantic hadith search
- **AI Services**: Google Text Embedding API and Groq AI

### External APIs
- **Location**: OpenStreetMap Nominatim API for address resolution
- **Prayer Times**: Adhan.js library for Islamic prayer calculations
- **Content Delivery**: GitHub raw content for PDF documents

### Security Features
- **Authentication**: JWT-based auth with Supabase
- **Route Protection**: Auth guards for protected routes
- **Input Sanitization**: Custom sanitization service
- **HTTPS Redirect**: Automatic HTTPS enforcement
- **Rate Limiting**: Client-side rate limiting for API calls
- **CORS**: Proper CORS configuration for edge functions