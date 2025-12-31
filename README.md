# Taqwa Tracker: Comprehensive Islamic Companion App

Taqwa Tracker is a feature-rich Islamic Progressive Web App (PWA) built with Angular 21 that serves as a complete digital companion for Muslims. The application seamlessly integrates essential Islamic tools including prayer times, Qibla direction, Quran reader, Hadith search, AI-powered Islamic chatbot, reading streak tracking, and Islamic calendar features.

This modern web application combines cutting-edge technologies with authentic Islamic resources to provide an intuitive and comprehensive platform. It leverages geolocation services for precise prayer calculations, integrates with a centralized backend for robust data management and authentication, implements AI-driven Islamic guidance through agentic workflows, and ensures offline accessibility through advanced service worker implementation.

## Repository Structure

```
taqwa-tracker-web/
├── docs/
├── public/
│   ├── fonts/
│   ├── icons/
│   ├── favicon.ico
│   ├── icon.png
│   └── manifest.webmanifest
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── reset-password/
│   │   ├── chatbot/
│   │   │   └── hadith-links/
│   │   ├── feedback/
│   │   ├── guard/
│   │   ├── header/
│   │   │   ├── menu/
│   │   │   └── settings/
│   │   ├── home/
│   │   │   ├── sacred/
│   │   │   │   ├── hadith/
│   │   │   │   │   ├── chapter/
│   │   │   │   │   └── hadith.service.ts
│   │   │   │   ├── library/
│   │   │   │   │   ├── reader/
│   │   │   │   │   └── library.service.ts
│   │   │   │   └── quran/
│   │   │   │       ├── ayah/
│   │   │   │       └── quran.service.ts
│   │   │   ├── streak-dashboard/
│   │   │   ├── tool/
│   │   │   │   ├── calculator/
│   │   │   │   ├── calendar/
│   │   │   │   ├── kaaba/
│   │   │   │   ├── prayer-times/
│   │   │   │   │   └── rakat/
│   │   │   │   └── tasbih/
│   │   │   └── welcome/
│   │   ├── interceptor/
│   │   │   └── auth.interceptor.ts
│   │   ├── mobile/
│   │   ├── model/
│   │   ├── pipes/
│   │   ├── profile/
│   │   ├── service/
│   │   │   ├── auth-token.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auto-update.service.ts
│   │   │   ├── bookmark.service.ts
│   │   │   ├── captcha.service.ts
│   │   │   ├── chatbot.service.ts
│   │   │   ├── https-redirect.service.ts
│   │   │   ├── rate-limit.service.ts
│   │   │   ├── read-streak.service.ts
│   │   │   ├── salah-app.service.ts
│   │   │   ├── sanitization.service.ts
│   │   │   ├── security-headers.service.ts
│   │   │   ├── tasbih.service.ts
│   │   │   └── theme.service.ts
│   │   ├── shared/
│   │   │   ├── install-pwa/
│   │   │   └── privacy-policy/
│   │   ├── app.component.*
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.prod.ts
│   │   └── environment.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── ngsw-config.json
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### Key Files:
- `src/main.ts`: Entry point of the application
- `src/app/app.config.ts`: Application configuration with providers
- `src/app/app.routes.ts`: Application routing configuration
- `src/environments/environment.ts`: Environment-specific configuration
- `angular.json`: Angular CLI configuration
- `ngsw-config.json`: Service Worker configuration for PWA features
- `public/manifest.webmanifest`: PWA manifest configuration

### Important Integration Points:
- **Centralized API**: Core backend service providing authentication, data storage, and AI agent endpoints (`https://api.thetaqwatracker.com`).
- **OpenStreetMap API**: Location services and address resolution.
- **Adhan.js**: Prayer time calculations and Qibla direction.
- **AI Chatbot**: Intelligent chatbot powered by agentic workflows on the backend.
- **marked & DOMPurify**: Markdown rendering and sanitization for chatbot responses.
- **ng2-pdf-viewer**: PDF viewing for Islamic library documents.

## Usage Instructions

### Installation

Prerequisites:
- Node.js (v20 or later)
- npm (v10 or later)
- Angular CLI (v21 or later)

Steps:
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
   ```bash
   # Create src/environments/environment.ts and add the following:
   # export const environment = {
   #     production: false,
   #     github: {
   #         pdfUri: 'raw.githubusercontent.com/ezazulhaq/library/master/taqwa_tracker',
   #     },
   #     api: {
   #         map: 'https://nominatim.openstreetmap.org/reverse'
   #     },
   #     apiBaseUrl: 'https://api.thetaqwatracker.com'
   # };
   ```

### Getting Started

To run the application in development mode:

```bash
npm start
```

This will start the development server, typically at `http://localhost:4200`.

### Configuration

The application uses environment files for configuration:
- `src/environments/environment.ts`: Development configuration
- `src/environments/environment.prod.ts`: Production configuration

Both files define the `apiBaseUrl` used to communicate with the Taqw Tracker API.

### Building for Production

To build the application for production:

```bash
npm run build
```

This will generate a production-ready build in the `dist/taqwa-tracker` directory with:
- Service Worker enabled for offline functionality
- Optimized bundles with tree-shaking

### Testing

To run the unit tests:

```bash
npm test
```

### Troubleshooting

1. **Location Services Not Working**
   - Solution: Check browser permissions and internet connectivity.
2. **Authentication Issues**
   - Solution: Verify API connectivity and clear browser storage if needed.
3. **Chatbot Not Responding**
   - Solution: Ensure you are authenticated and the backend API is reachable.
4. **Offline Mode Issues**
   - Solution: Visit the app while online first to cache resources properly.

## Features

### Core Features
- **Prayer Times**: Accurate prayer times based on user location using Adhan.js.
- **Qibla Direction**: Real-time Kaaba direction with compass visualization.
- **Quran Reader**: Complete Quran with translations and interactive ayah tools.
- **Hadith Search**: Searchable hadith database with chapter navigation.
- **Islamic Library**: Integrated PDF reader for Islamic books.
- **Tasbih Counter**: Digital prayer counter with custom dhiks.

### Advanced Features
- **AI Islamic Chatbot**: Intelligent chatbot for Islamic questions and guidance.
- **User Authentication**: Secure login, registration, and profile management via the central API.
- **Progressive Web App**: Full PWA support with offline caching and mobile installation.

### Technical Features
- **Responsive Design**: Mobile-first design using Tailwind CSS.
- **Modern State Management**: Uses Angular signals for efficient UI updates.
- **Security**: Centralized token management, route guards, and input sanitization.

## Deployment

### Prerequisites
- SSH access to a web server or a static hosting service.
- SSL certificate (required for PWA features).

### Deployment Steps
1. Build the production bundle: `npm run build`.
2. Deploy the contents of `dist/taqwa-tracker` to your hosting provider.
3. Configure the server to fallback to `index.html` for single-page application routing.

## Architecture

### Frontend Architecture
- **Framework**: Angular 21 with Standalone Components.
- **Styling**: Tailwind CSS.
- **State Management**: Angular Signals and RxJS.
- **PWA**: Angular Service Worker.

### Backend Infrastructure
- **API Gateway**: Centralized API at `https://api.thetaqwatracker.com`.
- **Database**: Managed PostgreSQL for user data and Islamic content.
- **AI Engine**: Backend workflows for agentic Islamic guidance.

### Security Features
- **Token-based Auth**: Secure JWT handling with `AuthTokenService`.
- **Interceptors**: Automatic injection of auth headers.
- **Sanitization**: Client-side content sanitization using DOMPurify.