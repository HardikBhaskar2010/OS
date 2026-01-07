# 💕 Couples App - Enhanced Functionality Implementation Plan

## Overview
Transform the couples app into a fully functional application with authentication, database persistence, and personalized dashboards for boyfriend and girlfriend.

## User Requirements
1. ✅ Make all features functional (Gallery, Letters, Mood, Questions)
2. ✅ MongoDB storage for all data (photos as base64)
3. ✅ Separate authentication for BF and GF with different dashboards
4. ✅ Username + password authentication (fully local)
5. ✅ In-app notifications for anniversaries
6. ✅ Use provided favicon as browser icon

---

## Implementation Phases

### Phase 1: Favicon & Environment Setup
**Files to modify:**
- `/app/frontend/public/` - Add favicon.png
- `/app/frontend/index.html` - Update favicon reference

**Tasks:**
- [x] Copy favicon to public folder
- [x] Update HTML to reference favicon

---

### Phase 2: Backend - Authentication System
**Files to create/modify:**
- `/app/backend/models/user.py` - User model
- `/app/backend/auth/jwt_handler.py` - JWT utilities
- `/app/backend/auth/password_utils.py` - Password hashing
- `/app/backend/routers/auth.py` - Authentication endpoints
- `/app/backend/middleware/auth_middleware.py` - JWT verification

**Data Model - User:**
```python
{
    "id": "uuid",
    "username": "string",
    "password_hash": "string",
    "role": "boyfriend" | "girlfriend",
    "display_name": "string",
    "partner_id": "uuid | null",
    "anniversary_date": "datetime",
    "relationship_start": "datetime",
    "created_at": "datetime"
}
```

**API Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/link-partner` - Link to partner account

---

### Phase 3: Backend - Core Data Models
**Files to create:**
- `/app/backend/models/letter.py`
- `/app/backend/models/photo.py`
- `/app/backend/models/mood.py`
- `/app/backend/models/question.py`
- `/app/backend/models/notification.py`

**Data Models:**

**LoveLetter:**
```python
{
    "id": "uuid",
    "title": "string",
    "content": "string",
    "from_user_id": "uuid",
    "from_name": "string",
    "to_user_id": "uuid",
    "created_at": "datetime"
}
```

**Photo:**
```python
{
    "id": "uuid",
    "image_base64": "string",
    "caption": "string",
    "date": "string",
    "uploaded_by": "uuid",
    "uploader_name": "string",
    "created_at": "datetime"
}
```

**Mood:**
```python
{
    "id": "uuid",
    "user_id": "uuid",
    "username": "string",
    "mood": "string",
    "emoji": "string",
    "note": "string",
    "created_at": "datetime"
}
```

**Question:**
```python
{
    "id": "uuid",
    "question_text": "string",
    "category": "string",
    "date": "date"
}
```

**Answer:**
```python
{
    "id": "uuid",
    "question_id": "uuid",
    "user_id": "uuid",
    "username": "string",
    "answer_text": "string",
    "created_at": "datetime"
}
```

---

### Phase 4: Backend - API Endpoints
**Files to create:**
- `/app/backend/routers/letters.py`
- `/app/backend/routers/photos.py`
- `/app/backend/routers/moods.py`
- `/app/backend/routers/questions.py`
- `/app/backend/routers/notifications.py`

**API Endpoints:**

**Letters:**
- `GET /api/letters` - Get all letters for the couple
- `POST /api/letters` - Create new letter
- `DELETE /api/letters/{id}` - Delete letter

**Photos:**
- `GET /api/photos` - Get all photos
- `POST /api/photos` - Upload new photo (base64)
- `DELETE /api/photos/{id}` - Delete photo

**Moods:**
- `GET /api/moods` - Get mood history
- `POST /api/moods` - Share current mood
- `GET /api/moods/latest` - Get both partners' latest moods

**Questions:**
- `GET /api/questions/daily` - Get today's question
- `POST /api/answers` - Submit answer
- `GET /api/answers/{question_id}` - Get answers for a question

**Notifications:**
- `GET /api/notifications` - Get user's notifications
- `PUT /api/notifications/{id}/read` - Mark as read

---

### Phase 5: Frontend - Authentication UI
**Files to create:**
- `/app/frontend/src/pages/Login.tsx`
- `/app/frontend/src/pages/Register.tsx`
- `/app/frontend/src/contexts/AuthContext.tsx`
- `/app/frontend/src/components/ProtectedRoute.tsx`

**Files to modify:**
- `/app/frontend/src/App.tsx` - Add auth routes

**Features:**
- Login form with username/password
- Register form with role selection (BF/GF)
- Auth context for global state
- JWT storage in localStorage
- Auto-login on page refresh
- Protected routes wrapper

---

### Phase 6: Frontend - Role-Based UI
**Files to modify:**
- `/app/frontend/src/pages/Index.tsx` - Personalized dashboard
- `/app/frontend/src/components/HeroSection.tsx` - Role-based greeting
- `/app/frontend/src/index.css` - BF/GF theme variants

**Features:**
- Different color schemes (BF: blue tones, GF: pink tones)
- Personalized welcome messages
- Show partner's name and role
- Custom nicknames based on role

---

### Phase 7: Frontend - Connect Features to Backend
**Files to modify:**
- `/app/frontend/src/pages/Gallery.tsx`
- `/app/frontend/src/pages/Letters.tsx`
- `/app/frontend/src/pages/Mood.tsx`
- `/app/frontend/src/pages/Questions.tsx`
- `/app/frontend/src/components/PhotoGallery.tsx`
- `/app/frontend/src/components/LoveLetters.tsx`
- `/app/frontend/src/components/MoodSharing.tsx`
- `/app/frontend/src/components/DailyQuestion.tsx`

**API Integration Features:**

**Gallery:**
- File upload with preview
- Convert image to base64
- Save to backend
- Fetch all photos
- Delete photos

**Letters:**
- Save letters to database
- Fetch all letters
- Delete letters
- Show sender name

**Mood:**
- Submit current mood
- View mood history
- See partner's latest mood
- Mood statistics

**Questions:**
- Fetch daily question
- Submit answer
- View partner's answer
- Answer history

---

### Phase 8: Frontend - Notifications System
**Files to create:**
- `/app/frontend/src/components/NotificationBell.tsx`
- `/app/frontend/src/components/NotificationList.tsx`

**Files to modify:**
- `/app/frontend/src/components/HeroSection.tsx` - Add notification bell

**Features:**
- Bell icon with unread count badge
- Dropdown with notification list
- Anniversary reminders
- Special date alerts
- Mark as read functionality

---

### Phase 9: Backend - Notification Logic
**Files to create:**
- `/app/backend/services/notification_service.py`

**Features:**
- Calculate upcoming anniversaries
- Generate notifications for special dates
- 7 days before anniversary
- 1 day before anniversary
- On the day

---

### Phase 10: Testing & Refinement
**Testing checklist:**
- [ ] User registration (BF and GF)
- [ ] User login
- [ ] Partner linking
- [ ] Photo upload and display
- [ ] Letter creation and display
- [ ] Mood sharing and history
- [ ] Daily questions and answers
- [ ] Notifications display
- [ ] Role-based dashboard differences
- [ ] Logout and session management

---

## Technical Stack
- **Backend:** FastAPI + MongoDB + JWT Authentication
- **Frontend:** React + TypeScript + TailwindCSS
- **Storage:** MongoDB with base64 for images
- **Auth:** JWT tokens in localStorage

## Security Considerations
- Passwords hashed with bcrypt
- JWT tokens for session management
- Protected API routes with middleware
- CORS properly configured

## Database Collections
1. `users` - User accounts
2. `letters` - Love letters
3. `photos` - Photo gallery
4. `moods` - Mood tracking
5. `questions` - Daily questions pool
6. `answers` - Question answers
7. `notifications` - User notifications

---

## Estimated Implementation Time
- Phase 1: 10 minutes ✅
- Phase 2: 30 minutes (Backend Auth)
- Phase 3: 20 minutes (Models)
- Phase 4: 40 minutes (API Endpoints)
- Phase 5: 30 minutes (Frontend Auth)
- Phase 6: 20 minutes (Role UI)
- Phase 7: 60 minutes (Feature Integration)
- Phase 8: 30 minutes (Notifications)
- Phase 9: 20 minutes (Notification Logic)
- Phase 10: 30 minutes (Testing)

**Total: ~4-5 hours of focused development**

---

## Next Steps
1. Start with Phase 1 (Favicon)
2. Build backend authentication system
3. Create all data models and APIs
4. Build frontend authentication
5. Connect all features to backend
6. Add notifications
7. Test thoroughly
8. Polish and refine

Let's build this! 💕
