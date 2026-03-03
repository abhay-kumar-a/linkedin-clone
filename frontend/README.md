# LinkedIn Clone - Frontend

React.js frontend application for the LinkedIn Clone microservices backend.

## Features

- **Authentication** - Login and Registration with JWT
- **User Profiles** - View and edit profiles, add experiences
- **Posts/Feed** - Create posts, like, comment
- **Jobs** - Browse and apply for jobs
- **Companies** - View company pages
- **Network** - Manage connections
- **Chat** - Real-time messaging

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend services running on localhost:8080

## Installation

```bash
cd frontend
npm install
```

## Running the Application

```bash
npm run dev
```

The app will start on http://localhost:3000

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8080
```

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/     # Reusable components
│   ├── context/       # React context (Auth)
│   ├── pages/         # Page components
│   ├── services/     # API services
│   ├── App.jsx       # Main app with routing
│   ├── main.jsx      # Entry point
│   └── index.css     # Global styles
├── package.json
└── vite.config.js
```

## Tech Stack

- React 18
- React Router v6
- Axios
- JWT Decode
- React Icons
- React Toastify
- Vite

## API Integration

The frontend integrates with the following microservices:

- Auth Service (Port 8080)
- User Service
- Post Service
- Company-Job Service
- Chat Service
- File Service

Configure the API base URL in `src/services/api.js` or via environment variables.
