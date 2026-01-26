# Taqwa Tracker: Comprehensive Islamic Companion App

The Taqwa Tracker is a feature-rich Islamic Progressive Web App (PWA) built with **Angular 21** that serves as a complete digital companion for Muslims. The application seamlessly integrates essential Islamic tools including prayer times, Qibla direction, Quran reader, Hadith search, AI-powered Islamic chatbot, reading streak tracking, Islamic calendar features, and educational games.

This modern web application combines cutting-edge technologies with authentic Islamic resources to provide an intuitive and comprehensive platform. It leverages geolocation services for precise prayer calculations, integrates with a centralized backend for robust data management and authentication, implements AI-driven Islamic guidance through agentic workflows, and ensures offline accessibility through advanced service worker implementation.

## Technology Stack

### Frontend
- **Framework**: Angular 21 (Latest)
- **Architecture**: 100% Standalone Components
- **State Management**: Angular Signals (`signal`, `computed`, `effect`, `linkedSignal`)
- **Styling**: TailwindCSS 3.4+ with Dark Mode support
- **Change Detection**: `ChangeDetectionStrategy.OnPush` throughout
- **PWA**: Angular Service Worker with offline-first caching
- **Build Tool**: Angular CLI with Vite-based build system

### Key Libraries
- **`adhan` (4.4.3)**: Prayer time calculations and Qibla direction
- **`moment-hijri` (3.0.0)**: Hijri calendar conversion and formatting
- **`ng2-pdf-viewer` (10.4.0)**: PDF document viewing for Islamic library
- **`marked` (16.3.0)**: Markdown rendering for chatbot responses
- **`dompurify` (3.3.1)**: HTML sanitization for security
- **`@vercel/analytics` (1.6.1)**: Web analytics integration

### Backend Integration
- **API**: Centralized REST API at `https://api.thetaqwatracker.com`
- **Authentication**: JWT-based with automatic token refresh
- **Database**: PostgreSQL (managed by backend)
- **AI Engine**: Custom agentic workflow for Islamic guidance

## Repository Structure

```
taqwa-tracker-web/
├── docs/                       # Documentation files
├── public/
│   ├── fonts/                  # Custom web fonts
│   ├── icons/                  # App icons and favicons
│   ├── favicon.ico
│   ├── icon.png
│   └── manifest.webmanifest    # PWA manifest
├── src/
│   ├── app/
│   │   ├── auth/               # Authentication Module
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── reset-password/
│   │   ├── chatbot/            # AI Islamic Chatbot
│   │   │   └── hadith-links/   # Hadith reference extraction
│   │   ├── feedback/           # User feedback system
│   │   ├── guard/              # Route guards (auth protection)
│   │   ├── header/             # App header & navigation
│   │   │   ├── menu/           # Sidebar menu
│   │   │   └── settings/       # User settings (theme, Hanafi mode)
│   │   ├── home/               # Main Dashboard
│   │   │   ├── all-apps/       # App directory page
│   │   │   ├── app-icon/       # Reusable app icon component
│   │   │   ├── games/          # Educational Islamic Games
│   │   │   │   ├── quiz/       # Islamic Quiz Challenge
│   │   │   │   ├── memory/     # 99 Names Memory Match
│   │   │   │   ├── word-search/ # Arabic Word Search
│   │   │   │   ├── journey/    # Prophet's Journey
│   │   │   │   └── salah-master/ # Salah Master Game
│   │   │   ├── prayer-times-widget/ # Live prayer countdown widget
│   │   │   ├── recommended-apps-widget/ # Quick access tiles
│   │   │   ├── sacred/         # Sacred Texts Module
│   │   │   │   ├── hadith/     # Hadith browser
│   │   │   │   │   ├── chapter/ # Hadith chapter viewer
│   │   │   │   │   └── hadith.service.ts
│   │   │   │   ├── library/    # Islamic Library (PDF books)
│   │   │   │   │   ├── reader/ # PDF reader component
│   │   │   │   │   └── library.service.ts
│   │   │   │   └── quran/      # Quran Reader
│   │   │   │       ├── ayah/   # Ayah viewer with translation
│   │   │   │       ├── juz-list/ # Juz navigation
│   │   │   │       ├── surah-list/ # Surah navigation
│   │   │   │       └── quran.service.ts
│   │   │   ├── streak-dashboard/ # Reading streak tracker
│   │   │   ├── tool/           # Islamic Tools
│   │   │   │   ├── calculator/ # Zakat Calculator
│   │   │   │   │   └── calculator-tool/ # Floating calculator widget
│   │   │   │   ├── calendar/   # Hijri Calendar
│   │   │   │   ├── kaaba/      # Qibla Compass
│   │   │   │   ├── prayer-times/ # Monthly prayer timetable
│   │   │   │   │   └── rakat/  # Rakat guide with details
│   │   │   │   └── tasbih/     # Digital Tasbih Counter
│   │   │   └── welcome/        # Welcome/onboarding screen
│   │   ├── interceptor/
│   │   │   └── auth.interceptor.ts # JWT token injection
│   │   ├── mobile/             # Mobile-specific components
│   │   ├── model/              # TypeScript Interfaces
│   │   │   ├── namaz-time.model.ts # Prayer times interface
│   │   │   ├── rakats.model.ts     # Rakat structure
│   │   │   └── ... (other models)
│   │   ├── pipes/              # Custom Angular pipes
│   │   ├── profile/            # User profile management
│   │   ├── service/            # Core Business Logic
│   │   │   ├── auth-token.service.ts # Token management
│   │   │   ├── auth.service.ts       # Authentication
│   │   │   ├── auto-update.service.ts # PWA update detection
│   │   │   ├── bookmark.service.ts   # Quran/Hadith bookmarks
│   │   │   ├── captcha.service.ts    # CAPTCHA integration
│   │   │   ├── chatbot.service.ts    # AI chatbot API
│   │   │   ├── https-redirect.service.ts # Force HTTPS
│   │   │   ├── rate-limit.service.ts # API rate limiting
│   │   │   ├── read-streak.service.ts # Streak tracking
│   │   │   ├── salah-app.service.ts  # Prayer calculations
│   │   │   ├── sanitization.service.ts # Input sanitization
│   │   │   ├── security-headers.service.ts # CSP headers
│   │   │   ├── tasbih.service.ts     # Tasbih state
│   │   │   └── theme.service.ts      # Dark mode
│   │   ├── shared/             # Reusable Components
│   │   │   ├── install-pwa/    # PWA install prompt
│   │   │   ├── pdf-viewer/     # PDF viewer wrapper
│   │   │   ├── privacy-policy/ # Privacy policy page
│   │   │   └── title/          # Page title component
│   │   ├── app.component.*     # Root component
│   │   ├── app.config.ts       # Application configuration
│   │   └── app.routes.ts       # Routing configuration
│   ├── environments/
│   │   ├── environment.prod.ts # Production config
│   │   └── environment.ts      # Development config
│   ├── index.html
│   ├── main.ts                 # Application entry point
│   └── styles.css              # Global styles
├── angular.json                # Angular CLI configuration
├── ngsw-config.json            # Service Worker config
├── package.json
├── tailwind.config.js          # TailwindCSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Core Features

### 1. Prayer Times Engine (`SalahAppService`)

**Advanced Prayer Calculation System**
- **Library**: `Adhan.js` integration for astronomical calculations
- **Calculation Methods**:
  - **Standard**: Muslim World League (default for non-Hanafi)
  - **Hanafi**: Moonsighting Committee with custom parameters
    - `Shafaq.Abyad` (white twilight) for later Isha time
    - Shadow ratio 2:1 for later Asr time
- **Supported Prayer Times**:
  - **Fajr**: Dawn prayer
  - **Sunrise**: Not a prayer but useful reference
  - **Dhuhr**: Noon prayer
  - **Asr**: Afternoon prayer (with Hanafi adjustment)
  - **Maghrib**: Sunset prayer
  - **Isha**: Night prayer (with Hanafi adjustment)
  - **Tahajjud**: Last third of the night (calculated via `SunnahTimes.lastThirdOfTheNight`)

**Live Prayer Widgets**
- **Real-time Countdown**: Updates every 60 seconds showing time until next prayer
- **Current Prayer Highlighting**: Smart logic identifies which prayer interval is active now
- **Monthly Timetable**: Full month view with all prayer times
- **Rakat Guide**: Detailed breakdown showing:
  - Fard (obligatory) rakats
  - Sunnah (recommended) rakats before/after
  - Nafl (voluntary) rakats
  - Wajib (necessary) rakats
  - **Tahajjud**: 2-11 rakats (flexible voluntary night prayer)

**Geolocation Integration**
- Uses browser Geolocation API for precise coordinates
- Falls back to OpenStreetMap Nominatim for reverse geocoding
- Displays current location address

### 2. Islamic Calendar

**Hijri Date System**
- **Library**: `moment-hijri` for accurate conversion
- **Features**:
  - Real-time Hijri date display (e.g., "Rajab 14, 1447 AH")
  - Month/year navigation
  - Gregorian to Hijri conversion
  - Special Islamic dates highlighting

### 3. Sacred Texts & Learning

**Quran Reader**
- Complete Quran text in Arabic
- English translation (Sahih International)
- Audio recitation support
- Navigation by:
  - **Surah** (114 chapters)
  - **Juz** (30 parts)
- **Ayah Features**:
  - Bookmarking system
  - Copy to clipboard
  - Share functionality
  - Translation toggle

**Hadith Search**
- Searchable database of authentic Hadiths
- Browse by chapter
- Copy hadith text
- Toast notifications for user feedback

**Islamic Library**
- PDF viewer integration (`ng2-pdf-viewer`)
- Content hosted on GitHub
- Books include:
  - Fortress of the Muslim (Hisnul Muslim)
  - Other Islamic literature
- Full-screen reading mode
- Page navigation controls

**Educational Games**
- **Islamic Quiz Challenge**: Test Islamic knowledge
- **99 Names Memory Match**: Learn Allah's names through gameplay
- **Arabic Word Search**: Find Islamic terms in Arabic
- **Prophet's Journey**: Interactive historical journey
- **Salah Master**: Learn prayer steps

### 4. Tools & Utilities

**Qibla Finder**
- Real-time compass pointing to Kaaba
- Uses device orientation API
- Visual compass with degree indicator
- Distance to Mecca calculation

**Tasbih Counter**
- Digital replacement for physical tasbih
- Custom dhikr support
- Vibration feedback on count
- Reset and history tracking
- Persistent state across sessions

**Zakat Calculator**
- Calculate annual Zakat obligation
- Based on gold/silver nisab
- Multiple asset categories:
  - Cash and savings
  - Gold and silver
  - Business assets
  - Investments
- Floating calculator widget for quick calculations

**Fasting Duas**
- Suhoor (pre-dawn) dua
- Iftar (breaking fast) dua
- Arabic text with transliteration and translation

### 5. AI Islamic Chatbot

**Intelligent Guidance System**
- **Backend**: Custom agentic workflow engine
- **Frontend Features**:
  - Markdown rendering via `marked`
  - HTML sanitization via `DOMPurify`
  - Hadith reference extraction and linking
  - Conversation history
  - Context-aware responses
- **Capabilities**:
  - Islamic Q&A
  - Quranic verse references
  - Hadith citations
  - Fiqh (jurisprudence) guidance
  - General Islamic knowledge

### 6. User Management & Authentication

**Security Features**
- **JWT Authentication**: Secure token-based auth
- **Token Management**: Automatic refresh and storage
- **HTTP Interceptor**: Auto-injection of Bearer tokens
- **Route Guards**: Protected routes require authentication
- **Input Sanitization**: All user input sanitized
- **HTTPS Enforcement**: Automatic redirect to secure connection

**User Profile**
- Personal information management
- Preference settings:
  - **Hanafi Mode**: Toggle for Hanafi prayer calculations
  - **Theme**: Light/Dark/System
- Reading streak tracking
- Account deletion option

**Streak Dashboard**
- Visual tracking of daily engagement
- Quran reading streaks
- Hadith reading streaks
- Prayer time check-ins
- Gamification elements

### 7. Progressive Web App (PWA)

**Offline Capabilities**
- Service Worker caching strategy
- Offline-first architecture
- Background sync for data
- Update notifications

**Installation**
- "Add to Home Screen" prompt
- Native app-like experience
- Splash screen
- App icons for all platforms

## Usage Instructions

### Prerequisites
- Node.js (v20 or later)
- npm (v10 or later)
- Angular CLI (v21 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd taqwa-tracker-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   
   Create `src/environments/environment.ts`:
   ```typescript
   export const environment = {
       production: false,
       github: {
           // GitHub raw content URL for PDF library
           pdfUri: 'raw.githubusercontent.com/ezazulhaq/library/master/taqwa_tracker',
       },
       api: {
           // OpenStreetMap reverse geocoding
           map: 'https://nominatim.openstreetmap.org/reverse'
       },
       // Centralized backend API
       apiBaseUrl: 'https://api.thetaqwatracker.com'
   };
   ```

### Development Server

Start the development server:
```bash
npm start
```

Navigate to `http://localhost:4200`. The application will automatically reload when you modify source files.

### Building for Production

Generate optimized production build:
```bash
npm run build
```

Output will be in `dist/taqwa-tracker` with:
- Service Worker enabled for offline functionality
- AOT (Ahead-of-Time) compilation
- Tree-shaking for minimal bundle size
- Optimized assets and lazy loading

### Testing

Run unit tests:
```bash
npm test
```

### Troubleshooting

**Location Services Not Working**
- Check browser permissions for geolocation
- Ensure HTTPS connection (required for geolocation API)
- Verify internet connectivity

**Authentication Issues**
- Clear browser storage (localStorage/sessionStorage)
- Verify API connectivity to `api.thetaqwatracker.com`
- Check network console for 401/403 errors

**Chatbot Not Responding**
- Ensure you are authenticated
- Check backend API status
- Verify network connection

**Offline Mode Issues**
- Visit app while online first to cache resources
- Check Service Worker registration in DevTools
- Clear cache and re-register Service Worker if needed

**Prayer Times Incorrect**
- Verify location permissions
- Check Hanafi mode setting matches your preference
- Ensure correct date/time on device

## Architecture

### Frontend Architecture

**Component Strategy**
- 100% Standalone Components (no NgModules)
- `ChangeDetectionStrategy.OnPush` for performance
- Signal-based reactive state management
- Lazy loading for all major routes

**State Management Philosophy**
- **Signals** for local component state and derived values
- **RxJS** for asynchronous operations (HTTP, events)
- **Services** for shared state across components
- **Effects** for side effects and subscriptions

**Routing Strategy**
- Lazy-loaded route modules
- Route guards for authentication
- `withComponentInputBinding` for route params as inputs
- Preloading strategy for critical routes

### Backend Infrastructure

**API Architecture**
- RESTful API design
- JWT-based authentication
- Rate limiting and request throttling
- CORS configuration for web clients

**Database**
- PostgreSQL for relational data
- User profiles and preferences
- Bookmark and streak data
- Chatbot conversation history

**AI Engine**
- Custom agentic workflow system
- Context-aware response generation
- Hadith and Quran reference integration
- Natural language processing

### Security Features

**Authentication & Authorization**
- JWT tokens with expiration
- Automatic token refresh
- Secure token storage
- Route-level access control

**Input Validation & Sanitization**
- DOMPurify for HTML sanitization
- Input validation on all forms
- XSS prevention
- CSRF protection

**Content Security**
- Content Security Policy (CSP) headers
- HTTPS enforcement
- Secure cookie flags
- Rate limiting

### Performance Optimizations

**Change Detection**
- `OnPush` strategy throughout
- Signal-based updates for granular reactivity
- Minimal Zone.js overhead

**Bundle Optimization**
- Lazy loading for routes
- Tree-shaking unused code
- Image optimization
- Font subsetting

**Caching Strategy**
- Service Worker for offline assets
- HTTP caching headers
- LocalStorage for user preferences
- IndexedDB for large datasets

## Deployment

### Prerequisites
- Web server or static hosting service
- SSL certificate (required for PWA and geolocation)
- Domain name

### Deployment Steps

1. Build production bundle:
   ```bash
   npm run build
   ```

2. Deploy `dist/taqwa-tracker` contents to hosting provider

3. Configure server:
   - Serve `index.html` for all routes (SPA fallback)
   - Enable HTTPS
   - Set appropriate cache headers
   - Configure CORS if needed

### Recommended Hosting Platforms
- **Vercel**: Zero-config deployment with analytics
- **Netlify**: Automatic HTTPS and CDN
- **Firebase Hosting**: Google Cloud integration
- **AWS S3 + CloudFront**: Scalable static hosting

## Contributing

Contributions are welcome! Please follow these guidelines:
- Follow Angular style guide
- Use Signals for state management
- Maintain `OnPush` change detection
- Write unit tests for new features
- Update documentation

## License

[Specify your license here]

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Adhan.js Documentation](https://github.com/batoulapps/adhan-js)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)