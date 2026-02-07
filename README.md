# Mini Course Subscription Application – Black Friday Edition

Full-stack course subscription app with JWT auth, mock payments, and a Black Friday promo code. No real payment gateway.

## Tech Stack

- **Frontend:** React, React Router, TailwindCSS, Axios, Vite
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- **Payments:** Mock only (no real gateway)

---

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string)

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI and JWT_SECRET
npm install
npm run seed
npm run dev
```

Backend runs at **http://localhost:5000**.

### 2. Frontend

```bash
cd frontend
# Optional: cp .env.example .env and set VITE_API_URL for production build
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** and proxies API requests to the backend.

---

## Dummy Credentials (from seed)

Use these to log in after running `npm run seed` in the backend:

| Email             | Password |
|-------------------|----------|
| alice@demo.com    | demo123  |
| bob@test.com      | test123  |
| charlie@user.com  | user123  |

---

## Promo Code

- **Code:** `BFSALE25`
- **Effect:** 50% off paid courses only.
- **Rules:** Required for any paid course; Subscribe stays disabled until the promo is applied. Free courses do not require a promo.

---

## API Overview

| Method | Endpoint           | Auth   | Description                |
|--------|--------------------|--------|----------------------------|
| POST   | /auth/signup       | No     | Register, returns JWT      |
| POST   | /auth/login        | No     | Login, returns JWT         |
| GET    | /courses           | No     | List all courses           |
| GET    | /courses/:id       | No     | Get one course             |
| POST   | /subscribe         | Yes    | Subscribe (free or paid)   |
| GET    | /my-courses        | Yes    | Current user’s subscriptions |

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── constants/promo.js
│   │   ├── middleware/auth.js
│   │   ├── models/ (User, Course, Subscription)
│   │   ├── routes/ (auth, courses, subscriptions, myCourses)
│   │   ├── scripts/seed.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/ (Layout, ProtectedRoute)
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/ (Login, Home, CourseDetail, MyCourses, NotFound)
│   │   ├── App.jsx, main.jsx, index.css
│   │   └── ...
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Deployment

### Backend (Render / Railway)

- Set env vars: `MONGODB_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_URL` (your frontend URL).
- Build command: not needed (Node app).
- Start command: `npm start` (runs `node src/server.js`).

### Frontend (Vercel / Netlify)

- Set `VITE_API_URL` to your deployed backend URL (e.g. `https://your-app.onrender.com`).
- Build command: `npm run build`.
- Publish directory: `dist`.

---

## Screenshots

After running backend seed and both servers:


<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/190755f0-682b-4bef-8a95-9f7662810fc1" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/a0946ae8-70ac-4454-ba4b-46a529dff831" />
<img width="1911" height="1074" alt="image" src="https://github.com/user-attachments/assets/f5017706-3083-47d7-a4b1-3eb545b23167" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/ea4a23ae-7e23-4295-9709-0cbbe219471d" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/449b640b-aa4b-40c9-851c-803e36427d99" />
<img width="1919" height="1073" alt="image" src="https://github.com/user-attachments/assets/3e963008-a858-489e-b092-81c20f53e5d0" />

---

## Security

- Passwords hashed with bcrypt.
- JWT for protected routes; token stored in `localStorage` on the client.
- Auth middleware on `/subscribe` and `/my-courses`.
- Use strong `JWT_SECRET` and env vars in production.
