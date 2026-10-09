# ConnectHub — Development Progress Report

**Project Title:** An AI-Assisted Framework for Stakeholder Concern Processing: Design and Implementation of ConnectHub

**Course:** Bachelor of Science in Computer Science
**Institution:** Jose Rizal Memorial State University — Main Campus
**College:** College of Computing Studies

**Proponents:**
- Leo Alfier S. Antipuesto
- Jashtenne Jardin
- Judel Jhon Cubelo

**Date of Report:** October 2, 2026

---

## 1. Executive Summary

This progress report documents the current state of the **ConnectHub** system — a configurable web/mobile-based platform for information dissemination, concern reporting, and AI-assisted stakeholder concern processing. The system serves as the implementation and demonstration environment for the proposed **Human-in-the-Loop AI-Assisted Stakeholder Concern Processing Framework (HISCPF)**.

As of this report, the **frontend user interface** has been implemented using **React Native with Expo**, covering both the **stakeholder-facing** and **administrative** sides of the application. A total of **13 functional screens** have been developed, all aligned with the system's thesis proposal requirements.

---

## 2. System Overview

ConnectHub is designed around two primary user roles:

| Role | Description |
|------|-------------|
| **Stakeholder** | End-users (students, employees, citizens, etc.) who submit concerns, view announcements, track concern status, and provide feedback. |
| **Administrator / Staff** | Authorized personnel who review submitted concerns, evaluate AI-generated suggestions, make final decisions on category/priority, manage announcements, and oversee system operations. |

The system follows the **HISCPF** workflow:

```
Stakeholder Concern → Validation → AI-Assisted Analysis → AI Response Validation
→ Human Review → Final Human Confirmation → Concern Management → Evaluation
```

A **manual fallback** path is also implemented for cases where AI assistance is unavailable or unsuitable.

---

## 3. Implemented Features (Chunk 1)

### 3.1 Stakeholder-Side Screens

| # | Screen | Description | Status |
|---|--------|-------------|--------|
| 1 | **Home Dashboard** | Displays quick statistics (pending, in-progress, resolved concerns), quick action buttons (submit concern, track concerns, view announcements), recent announcements, and the user's recent concern submissions. | ✅ Complete |
| 2 | **Submit Concern** | A structured concern submission form with fields for title, category (dropdown picker), target department (dropdown picker), detailed description (multiline), and file attachment placeholder. Includes an informational banner referencing the HITL AI-Assisted Framework. | ✅ Complete |
| 3 | **My Concerns** | A filterable list of the user's submitted concerns. Supports filtering by status (All, Pending, Under Review, In Progress, Resolved). Each concern card displays status badge, priority badge, title, description snippet, category, department, date, and response count. | ✅ Complete |
| 4 | **Concern Detail** | Full concern view with a color-coded status banner, description, meta-information grid (category, department, submitted date, last updated), a visual **status timeline** showing all status transitions with dates, personnel, and notes, and a **threaded responses** section showing admin/staff replies. | ✅ Complete |
| 5 | **Announcements** | Displays organizational announcements and advisories. Pinned items appear at the top. Each announcement shows type badge (Announcement vs. Advisory), title, content, department, author, and publication date. | ✅ Complete |
| 6 | **Notifications** | A notification center showing status updates, new responses, new announcements, and system messages. Uses color-coded icons per notification type and unread indicators (dot badge). Tapping a notification navigates to the related concern. | ✅ Complete |
| 7 | **Profile** | User account screen with avatar, name, email, department, role display, and concern statistics (submitted, resolved, active). Includes an Overview tab (account info, quick links) and a Settings tab (push/email notification preferences, logout). | ✅ Complete |

### 3.2 Authentication Screens

| # | Screen | Description | Status |
|---|--------|-------------|--------|
| 8 | **Login** | Login screen with **role selector** (Stakeholder vs. Administrator). Selecting a role routes the user to the appropriate home screen upon login. Includes email/password fields, remember me checkbox, and forgot password link. | ✅ Complete |
| 9 | **Sign Up** | Registration screen with full name, email, **department/office picker** (modal dropdown), and password fields. Branded for ConnectHub. | ✅ Complete |

### 3.3 Administrative Screens

| # | Screen | Description | Status |
|---|--------|-------------|--------|
| 10 | **Admin Dashboard** | Administrative overview showing total concerns, status breakdown (Pending, Under Review, In Progress, Resolved) with count cards, AI processing rate (percentage of concerns with AI suggestions), and a "Needs Review" queue showing pending concerns with AI availability indicators. | ✅ Complete |
| 11 | **Concern Queue** | A searchable, filterable list of all submitted concerns for administrative review. Each concern card shows status, priority, submitter info, date, and an AI suggestion badge with confidence percentage when available. | ✅ Complete |
| 12 | **Concern Review (HITL)** | **The core screen demonstrating the HISCPF.** Uses a three-tab layout reflecting the thesis framework's data separation principle: | ✅ Complete |
| | | — **Original Tab:** Shows the unmodified stakeholder concern with all submitted metadata. | |
| | | — **AI Suggestion Tab:** Displays AI-generated category, priority, confidence score (with visual bar), and AI-generated summary. Provides three action buttons: *Accept AI Suggestion*, *Edit/Override*, and *Manual Fallback*. | |
| | | — **Decision Tab:** Shows the final human-confirmed category and priority, the confirming personnel, and decision date. Includes a side-by-side **AI vs. Human Decision Comparison** panel showing whether the human accepted or overrode the AI suggestion. | |

### 3.4 Navigation

| Component | Description | Status |
|-----------|-------------|--------|
| **Stakeholder Bottom Nav** | 5-tab navigation: Home, Submit, Concerns, Alerts, Profile | ✅ Complete |
| **Admin Bottom Nav** | 4-tab navigation: Dashboard, Concerns, Alerts, Profile | ✅ Complete |
| **Route Layout** | Expo Router Stack layout with all 13 routes registered | ✅ Complete |

---

## 4. Alignment with Thesis Framework (HISCPF)

The following table maps the proposed framework components to their current implementation status:

| Framework Component | Implementation Status | Notes |
|---|---|---|
| **Concern Submission** | ✅ Implemented | Submit Concern screen with category, department, description |
| **Validation** | ⬜ Pending | Backend validation not yet implemented (requires Node.js + Express) |
| **AI-Assisted Analysis** | 🟡 UI Ready | AI suggestion panel built; actual Google Gemini API integration pending |
| **AI Response Validation** | 🟡 UI Ready | Confidence score display ready; backend validation pending |
| **Human Review** | ✅ Implemented | Three-tab review screen with Original / AI / Decision views |
| **Final Human Confirmation** | ✅ Implemented | Accept, Edit/Override, and Manual Fallback actions available |
| **Concern Management** | ✅ Implemented | Status tracking, timeline, response threading |
| **Data Separation** | ✅ Implemented | Original concern, AI suggestion, and human decision stored as separate data structures |
| **Manual Fallback** | ✅ Implemented | Manual processing button when AI is unavailable |
| **Evaluation** | ⬜ Pending | AI vs. Human comparison UI ready; evaluation data collection pending |

---

## 5. Data Model

The data model follows the thesis proposal's requirement for **three-layer data separation**:

```
┌─────────────────────────────────────────────────────────┐
│                    Concern Record                       │
├─────────────────────┬────────────────┬──────────────────┤
│  Original Concern   │  AI Suggestion │  Human Decision  │
│  (Stakeholder Data) │  (AI-Generated)│  (Final Confirm) │
├─────────────────────┼────────────────┼──────────────────┤
│  • title            │  • aiCategory  │  • confirmedCat  │
│  • description      │  • aiPriority  │  • confirmedPri  │
│  • category (user)  │  • aiSummary   │  • confirmedBy   │
│  • department       │  • confidence  │  • confirmedDate │
│  • dateSubmitted    │                │                  │
│  • submittedBy      │                │                  │
└─────────────────────┴────────────────┴──────────────────┘
```

Additional data types implemented:
- **Announcements** (title, content, type, department, author, pinned status)
- **Notifications** (status updates, responses, announcements, system alerts)
- **Status History** (timeline tracking with status, date, personnel, notes)
- **Concern Responses** (threaded replies from admin/staff)

---

## 6. Technology Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| **Frontend** | React Native + Expo (SDK) | ✅ Active |
| **Routing** | Expo Router (file-based) | ✅ Active |
| **UI Icons** | @expo/vector-icons (Ionicons) | ✅ Active |
| **Styling** | React Native StyleSheet | ✅ Active |
| **Backend** | Node.js + Express.js | ⬜ Not yet started |
| **Database** | MySQL | ⬜ Not yet started |
| **AI Service** | Google Gemini API | ⬜ Not yet started |
| **Authentication** | Role-based (mock) | 🟡 UI ready, backend pending |

> **Note:** The thesis proposal specifies **React.js** (web). The current implementation uses **React Native / Expo** (mobile), which provides cross-platform capability. This should be discussed with the panel regarding acceptability.

---

## 7. Current Limitations

1. **No backend server** — All data is currently static/mock. No Node.js + Express.js backend has been set up.
2. **No database** — MySQL integration has not been started.
3. **No real authentication** — Login/signup forms exist but do not perform actual authentication.
4. **No AI integration** — The AI suggestion panels display mock data. Google Gemini API has not been connected.
5. **No real-time notifications** — Notifications are displayed from static data.
6. **Platform consideration** — The thesis specifies React.js (web), but the implementation is in React Native (mobile). Panel approval may be required.

---

## 8. Next Steps

| Phase | Tasks | Target |
|-------|-------|--------|
| **Chunk 2** | Service request submission and tracking screens, user management (admin), information management (admin CRUD for announcements) | TBD |
| **Chunk 3** | Backend setup (Node.js + Express.js), MySQL database schema, real authentication with role-based access | TBD |
| **Chunk 4** | Google Gemini API integration for concern classification, priority suggestion, and summarization | TBD |
| **Chunk 5** | Evaluation data collection, AI vs. Human comparison metrics, reports/analytics dashboard | TBD |
| **Chunk 6** | Testing, optimization, ISO/IEC 25010 evaluation preparation, SUS deployment | TBD |

---

## 9. Screenshots

> Screenshots of the implemented screens can be provided upon request or during the next consultation. The application can be demonstrated live using Expo Go on a mobile device or through the Expo development server.

---

## 10. Summary

The **frontend UI foundation** of ConnectHub has been established with 13 functional screens covering both stakeholder and administrative workflows. The most significant implementation is the **Admin Concern Review screen**, which directly demonstrates the thesis's core contribution — the **Human-in-the-Loop AI-Assisted Stakeholder Concern Processing Framework** — through its three-panel layout separating original concern data, AI-generated suggestions, and final human decisions.

The next priority is **backend development** to connect the UI to actual data persistence and AI processing capabilities.

---

*Prepared by: Judel Jhon Cubelo*
*Date: October 2, 2026*
