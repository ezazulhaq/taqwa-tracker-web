# Release Notes - Taqwa Tracker v2.2.1

**Date:** January 20, 2026

Following the release of v2.2.0, we identified and resolved a critical synchronization issue in the Zakat calculator. This patch update ensures your calculations are correctly loaded across all your devices.

## Highlights

### 🔄 Zakat Calculation Synchronization Fix
We resolved an issue where saved calculations were only being retrieved from local storage, ignoring the user's cloud-saved data.
- **Backend Priority**: Authenticated users will now automatically see their most recent calculation fetched from the backend upon login.
- **Cross-Device Reliability**: Your Zakat records now follow you wherever you log in, providing a consistent experience across all platforms.

---

## Change Log

### Frontend (Web)

| Type | Description |
| :--- | :--- |
| **Fix** | Implemented proactive fetching of Zakat records from the API for authenticated users. |
| **Refactor** | Centralized state update logic to ensure consistent data merging (e.g., ensuring new asset categories like PF/NPS are correctly handled). |
| **Chore** | Bumped application version to v2.2.1. |

---

*Thank you for your feedback! We are committed to providing a reliable and spiritually rewarding experience with Taqwa Tracker.*
