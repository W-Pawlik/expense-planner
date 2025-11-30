# Expense Planner

Expense Planner is a full-stack web application for planning personal and group expenses.  
It helps you:

- Create “money groups” (financial goals),
- Add incomes and expenses,
- Forecast the fund balance over time,
- Share selected plans on a public board after administrator approval.

The system consists of:

- **Frontend** – a modern single-page application (SPA) for end users (authentication, dashboards, group management, public board, admin panel).
- **Backend** – a REST API written in **Node.js + TypeScript** with **Express**, **MongoDB (Mongoose)** and **Zod** for validation, organized as a **modular monolith**.

---

## Table of contents

- [Overview](#overview)
- [User-facing features](#user-facing-features)
  - [Authentication and user accounts](#authentication-and-user-accounts)
  - [Financial groups](#financial-groups)
  - [Public board](#public-board)
  - [Admin panel](#admin-panel)
- [System architecture](#system-architecture)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & configuration](#setup--configuration)
  - [Cloning the repository](#cloning-the-repository)
  - [Backend setup](#backend-setup)
  - [Frontend setup](#frontend-setup)
- [Running the project](#running-the-project)
- [Using the app – example flows](#using-the-app--example-flows)
  - [Regular user flow](#regular-user-flow)
  - [Admin flow](#admin-flow)
  - [Public board (no login)](#public-board-no-login)
- [API testing (backend)](#api-testing-backend)
- [Further development](#further-development)
- [`docs/API.md`](#docsapimd)

---

## Overview

Expense Planner is designed to support both **personal** and **shared** financial planning:

- Users can create **financial goals** (e.g. apartment, car, vacation),
- Attach **recurring and one-time positions** (income / expense),
- Monitor the **projected fund balance** over multiple years,
- Optionally **publish plans** on a public board to share with others, after admin moderation.

From a user’s perspective, everything is accessible through the web UI:

- Registration and login forms,
- Dashboard with a list of financial groups,
- Group detail view with all positions and projections,
- Public board with shared plans,
- Admin panel for moderation and user management.

Under the hood, the frontend communicates with the backend REST API described below.

---

## User-facing features

### Authentication and user accounts

Available both via UI and API:

- **Register a new account**

  - UI: registration form.
  - API: `POST /auth/register`.

- **Log in and receive a JWT token**

  - UI: login form, token stored client-side (localStorage).
  - API: `POST /auth/login`.

- **Roles**

  - `USER` – regular user.
  - `ADMIN` – administrator (all user permissions + admin tools).

- **Current user profile**
  - UI: “My profile” / “Account” page.
  - API: `GET /users/me` (requires `Authorization: Bearer <token>`).

---

### Financial groups

Core concept of the app – each group represents a **financial plan**:

- Examples: _“Apartment”_, _“Car”_, _“Wedding”_.
- Each group stores:
  - **Owner** (user),
  - **Name**,
  - **Number of projection years**,
  - **Visibility status**: `PRIVATE` / `PUBLIC`.

In the frontend, you typically get:

- **Groups list** – all your financial groups.
- **Group details view** – list of positions and projected fund info.
- **Create / edit / delete group** forms.

Groups support **financial positions** (items inside a group):

- `positionType`: `EXPENSE` / `INCOME`,
- `frequencyType`: `ONE_TIME` / `RECURRING`,
- `amount`,
- Optional: description, category, interest rate, etc.

---

### Public board

The public board allows sharing selected plans with the community.

- A user can **mark a group as public**.
- This automatically creates a **board post** in the backend.
- The post is visible on the public board **only after admin approval**.

In the frontend, you typically have:

- Public **board page** listing approved posts,
- **Post details page** with more information about the plan.

API endpoints:

- Public, no auth:
  - `GET /board` – list of accepted board posts,
  - `GET /board/:postId` – details of a given post.

---

### Admin panel

Admins get access to additional UI sections:

- **User management**
  - View users list.
  - Delete user accounts.
- **Board moderation**
  - View posts pending verification.
  - Approve or reject posts.

API endpoints:

- List users: `GET /admin/users`
- Delete user: `DELETE /admin/users/:id`
- List pending posts: `GET /admin/board/pending`
- Approve post: `POST /admin/board/posts/:postId/approve`
- Reject post: `POST /admin/board/posts/:postId/reject`

All require `Authorization: Bearer <ADMIN_TOKEN>`.

---

## System architecture

High-level architecture:

- **Frontend**

  - SPA that communicates with the backend via REST.
  - Handles routing (auth, dashboard, groups, board, admin).
  - Stores JWT token and attaches it to requests.

- **Backend**

  - REST API built in **Node.js + TypeScript** using **Express**.
  - **Modular monolith** – each domain module has:
    - `domain` – models/schemas/types,
    - `application` – business logic (services),
    - `infrastructure` – repositories, database access.
  - `apps` layer exposes HTTP controllers and routes only.

- **Database**

  - **MongoDB** with **Mongoose** as the ODM.

- **Auth**
  - JWT-based, with middleware for auth and role guarding.

---

## Tech stack

### Frontend

- **React** + **TypeScript**
- **MUI** for components
- **Emotion** for styling
- **Rect Query** for fetching, caching

### Backend

- **Node.js** + **TypeScript**
- **Express** – HTTP layer
- **MongoDB** + **Mongoose** – database and models
- **Zod** – data validation (body / query / params)
- **JWT (jsonwebtoken)** – authorization
- **bcrypt** – password hashing
- **dotenv** – configuration via `.env`
- Dev tooling:
  - `ts-node-dev` / `nodemon` – auto-restart on changes
  - ESLint + Prettier – code quality (optional)

---

## Project structure

```text
expense-planner/
  frontend/          # frontend app (SPA)
  backend/           # Node.js API (described below)
  docs/              # documentation (e.g. API docs)
```

---

## Prerequisites

- **Node.js** version ≥ 18
- **npm** or **yarn**
- **Docker + Docker Compose** (to run MongoDB)
- Access to a terminal (PowerShell / bash etc.)

---

## Setup & configuration

### Cloning the repository

```bash
git clone https://github.com/W-Pawlik/expense-planner.git
cd expense-planner
```

### Backend setup

1. Go to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file in `backend`:

   ```env
   PORT=3000
   MONGO_URI=mongodb://root:example@localhost:27017/expense-planner?authSource=admin
   JWT_SECRET=super-secret-key-change-me
   ```

4. MongoDB via Docker – example `docker-compose.yml` (in `backend` or higher):

   ```yaml
   services:
     mongo:
       image: mongo:6
       container_name: expense-planner-mongo
       ports:
         - "27017:27017"
       environment:
         MONGO_INITDB_ROOT_USERNAME: root
         MONGO_INITDB_ROOT_PASSWORD: example
       volumes:
         - mongo-data:/data/db

   volumes:
     mongo-data:
   ```

5. Run the database:

   ```bash
   docker compose up -d mongo
   ```

6. Check if the container is running:

   ```bash
   docker ps
   ```

### Frontend setup

1. Go to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file for the frontend – for example:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

---

## Running the project

1. **Start MongoDB** (if not already running):

   ```bash
   cd backend
   docker compose up -d mongo
   ```

2. **Start the backend** (in `backend/`):

   ```bash
   npm run dev
   ```

   By default, the backend will be available at:

   ```text
   http://localhost:3000
   ```

3. **Start the frontend** (in another terminal, in `frontend/`):

   ```bash
   cd frontend
   npm run dev
   ```

   The dev server will print the URL in the console (e.g. `http://localhost:5173`).
   Open it in your browser and start using the app.

---

## API testing (backend)

Even with the frontend available, it’s often convenient to test the API directly (e.g. for debugging or integration).

Recommended tools:

- **Postman**
- REST client

You can use the example requests from detailed documentation in `docs/API.md`.

---

## `backend/docs/API.md`

```markdown
# Expense Planner – API Documentation

Base URL (dev):

http://localhost:3000

The API is fully RESTful. Most endpoints send and receive data in JSON format.
```

```

```
