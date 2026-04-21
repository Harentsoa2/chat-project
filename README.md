# Whop

Whop is a full-stack real-time messaging platform with an AI assistant built into the chat experience. It combines authenticated conversations, live updates through Socket.IO, image sharing, threaded replies, and AI-powered responses backed by Google Generative AI.

## Overview

The project is split into two parts:

- `client/` - React + TypeScript + Vite frontend
- `backend/` - Express + TypeScript API, websocket server, and AI/message processing

The frontend handles routing, authentication UI, chat screens, and live updates. The backend stores users, chats, and messages in MongoDB, validates access, streams AI responses, and broadcasts websocket events to connected users.

## Key Features

- Authentication with JWT cookies and protected routes
- Real-time chat updates with Socket.IO
- One-to-one and group chats
- Threaded replies
- Image uploads through Cloudinary
- AI chat assistant powered by Google Generative AI
- Online users presence tracking
- Modern landing page with auth dialog
- Light and dark theme support

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Tailwind CSS 4
- Socket.IO client
- React Hook Form
- Zod
- Sonner for notifications
- next-themes for theme switching

### Backend

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- Passport JWT
- Socket.IO
- Cloudinary
- Google AI SDK
- bcryptjs
- cookie-parser
- cors
- helmet
- zod

## How It Works

### 1. Authentication

Users register or log in through the auth routes. The backend validates the input, generates a JWT, and stores it in a cookie. The frontend then checks `/auth/status` to restore the session and connect the websocket.

### 2. Route Protection

The client uses route guards to separate public pages from protected chat pages:

- public routes: sign in and sign up
- protected routes: chat list, single chat view, and message screens

### 3. Chat Lifecycle

When a user creates or opens a chat:

- the backend verifies membership
- the client joins the corresponding websocket room
- messages are fetched from MongoDB
- new messages are broadcast to the right chat room and user room

### 4. AI Response Flow

When a message is sent in an AI chat:

- the backend stores the user message
- the server builds the recent chat history
- Google Generative AI streams a response
- partial AI chunks are emitted live with Socket.IO
- the final AI message is saved and broadcast

### 5. Live Sync

Socket events keep the UI synchronized across users:

- `chat:new` for newly created chats
- `chat:update` for last-message updates
- `message:new` for live messages inside a chat
- `chat:ai` for streamed AI output
- `online:users` for presence updates

## Architecture

```text
client/
  src/
    components/        UI building blocks for landing, auth, and chat
    layouts/           Public and protected layout shells
    pages/             Route-level pages
    routes/            Route config and guards
    hooks/             Zustand stores and reusable hooks
    lib/               Axios client and helpers
    types/             Shared TypeScript types

backend/
  src/
    config/            Environment, database, passport, Cloudinary setup
    controllers/       Request handlers
    services/          Business logic
    models/            Mongoose schemas
    routes/            API route definitions
    lib/               Socket.IO server and event emitters
    validators/        Zod schemas
    middlewares/       Error handling and async helpers
```

## Important Dependencies

| Package | Purpose |
| --- | --- |
| `socket.io` / `socket.io-client` | Real-time messaging and presence |
| `mongoose` | MongoDB data modeling |
| `passport-jwt` | JWT authentication middleware |
| `jsonwebtoken` | Token generation and verification |
| `zod` | Validation for request payloads |
| `@ai-sdk/google` + `ai` | AI streaming integration |
| `cloudinary` | Image upload storage |
| `react-hook-form` + `@hookform/resolvers` | Form handling and validation |
| `zustand` | Client state management |
| `sonner` | Toast notifications |
| `tailwindcss` | Styling system |

## Environment Variables

### Backend

Create a `backend/.env` file with values like:

```env
NODE_ENV=development
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=15m
FRONTEND_ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_AI_API_KEY=your_google_ai_api_key
```

## Setup

### 1. Install dependencies

```bash
cd backend
npm install

cd ../client
npm install
```

### 2. Start the backend

```bash
cd backend
npm run dev
```

### 3. Start the frontend

```bash
cd client
npm run dev
```

### 4. Build for production

```bash
cd backend
npm run build

cd ../client
npm run build
```

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/status`

### Chats

- `POST /api/chat/create`
- `POST /api/chat/message/send`
- `GET /api/chat/all`
- `GET /api/chat/:id`

### Users

- `GET /api/user/all`

## Websocket Events

### Client listens to

- `chat:new`
- `chat:update`
- `message:new`
- `chat:ai`
- `online:users`

### Client emits

- `chat:join`
- `chat:leave`

## Notes

- The app uses JWT cookies, so browser requests must include credentials.
- Protected routes redirect unauthenticated users back to the landing/auth flow.
- AI replies are streamed, so the UI can display chunks before the full message is complete.
- The client landing page includes a reusable auth dialog provider, which must wrap any component using `useAuthDialog()`.

## Project Goal

Whop is designed as a modern chat app demo that shows how to combine:

- a polished marketing landing page
- secure login and session handling
- real-time messaging
- AI-assisted conversations
- clean separation between frontend and backend concerns

