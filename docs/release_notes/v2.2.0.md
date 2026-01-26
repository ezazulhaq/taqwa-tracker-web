# Release Notes - Taqwa Tracker v2.2.0

**Date:** January 19, 2026

We are excited to announce the release of **Taqwa Tracker v2.2.0**! This version introduces powerful new utility features, a centralized notification system, and significant under-the-hood performance improvements.

## Highlights

### 💰 Zakat Calculator Enhancements
- **Persistent Calculations**: You can now save your Zakat calculations for future reference.
- **Cloud Storage**: Authenticated users' data is automatically synced to the cloud, allowing you to access your records across devices.
- **Local Fallback**: Guest users can still benefit from persistent data via browser local storage.

### 🔔 New Toast Notification System
- We’ve implemented a centralized toast service that provides clean, modern, and non-intrusive feedback for actions like copying text, saving data, and authentication status.

### 🚀 Technical Upgrades
> [!IMPORTANT]
> **Angular v21.1.0 Upgrade**: The entire application has been upgraded to the latest Angular version, bringing improved performance, smaller bundle sizes, and the latest reactive paradigms. This is a significant framework jump that ensures long-term support and stability.

- **Enhanced API Resilience**: The backend now supports advanced upsert operations for calculation data, ensuring your records are always up to date without duplicates.

---

## Change Log

### Frontend (Web)

| Type | Description |
| :--- | :--- |
| **Feature** | Integrated `ToastService` for centralized UI notifications. |
| **Feature** | Implemented secure storage for Zakat calculations (Cloud & Local). |
| **Build** | Upgraded Angular CLI and core dependencies to v21.1.0. |
| **Fix** | Resolved letter grid overflow and responsiveness issues on mobile devices. |
| **Chore** | General UI/UX refinements for a smoother experience. |

### Backend (API)

| Type | Description |
| :--- | :--- |
| **Feature** | Introduced new Zakat storage endpoints with upsert logic. |
| **Refactor** | Centralized user data cleanup logic in `AuthService` for enhanced privacy. |
| **Feature** | Developed robust backend services to support multi-platform calculation storage. |

---

*Thank you for using Taqwa Tracker. If you have any feedback or encounter any issues, please reach out to our development team.*
