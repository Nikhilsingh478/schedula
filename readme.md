# Schedula - Doctor Appointment Booking App

A Next.js application for doctor appointment booking with a JSON Server backend.

## 🚀 Deployment Ready Setup

This app is now configured for deployment with separate frontend and backend.

### 📁 Project Structure
```
schedula/
├── app/                    # Next.js frontend
├── components/             # React components
├── backend/               # JSON Server backend
│   ├── server.js          # Production server
│   ├── package.json       # Backend dependencies
│   └── Procfile          # Heroku deployment
├── mock/                  # Database files
└── vercel.json           # Vercel configuration
```

## 🛠️ Local Development

### Frontend (Next.js)
```bash
npm install
npm run dev
```
Frontend will run on: http://localhost:3000

### Backend (JSON Server)
```bash
cd backend
npm install
npm run dev
```
Backend will run on: http://localhost:3001

## 🚀 Deployment Instructions

### 1. Deploy Backend (JSON Server)

#### Option A: Render.com (Recommended - Free)
1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Set environment variable: `PORT=3001`
7. Deploy

#### Option B: Railway.app
1. Go to [Railway.app](https://railway.app)
2. Create new project from GitHub
3. Set root directory to `backend`
4. Deploy

#### Option C: Heroku
1. Create new Heroku app
2. Set buildpack to Node.js
3. Deploy the `backend` folder
4. Set environment variable: `PORT=3001`

### 2. Deploy Frontend (Vercel)

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL` = Your backend URL (e.g., `https://your-app.onrender.com`)
4. Deploy

### 3. Update API URLs

After deploying the backend, update the frontend environment variable:
- Go to Vercel dashboard
- Navigate to your project settings
- Add environment variable: `NEXT_PUBLIC_API_URL`
- Set value to your backend URL

## 🔧 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Production
Set `NEXT_PUBLIC_API_URL` to your deployed backend URL in Vercel dashboard.

## 📝 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Backend
- `npm run server` - Start JSON server locally
- `npm run server:prod` - Start JSON server for production

## 🎯 API Endpoints

- `GET /doctors` - Get all doctors
- `GET /appointments` - Get all appointments
- `GET /slots` - Get available slots
- `POST /appointments` - Create new appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment

## 📊 Database

The app uses `mock/db.json` as the database file. This file contains:
- Doctors data
- Appointments data
- Patients data

## 🔒 CORS Configuration

The backend is configured with CORS enabled to allow frontend requests from any origin in production.

---

**Note:** This setup keeps your data intact and only adds deployment configuration. No data or functionality has been modified.
