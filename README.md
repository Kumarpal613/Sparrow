# Sparrow

Sparrow is a secure full-stack authentication platform built with React, Vite, FastAPI, and SQLAlchemy. It implements modern user onboarding, access control, and session management using JWT, OTP verification, and refresh token rotation.

## Project Structure

- `frontend/` — React + Vite frontend application
- `backend/` — FastAPI backend service (configured as a git submodule)

## Key Features

- Email OTP signup flow with temporary user staging and verification
- JWT-based login with short-lived access tokens and secure refresh tokens
- HTTP-only cookie storage for refresh tokens
- Token rotation and logout-all-devices support using token versioning
- Password recovery with OTP verification, resend cooldown, and secure reset
- Protected client-side routing with role-based access control (Admin dashboard)
- Secure password hashing and OTP hashing for authentication safety

## Tech Stack

- Frontend: React 18, Vite, React Router DOM, Axios, Lucide React
- Backend: FastAPI, SQLAlchemy, Pydantic, JWT, pwdlib
- Security: hashed passwords, hashed refresh tokens, OTP generation, JWT session tokens

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Kumarpal613/Sparrow.git
cd Sparrow
```

### 2. Initialize submodules

The backend is stored as a git submodule. Initialize it after cloning:

```bash
git submodule update --init --recursive
```

### 3. Backend setup

1. Go to `backend/`
2. Create a `.env` file with the required configuration values
3. Install Python dependencies and run the FastAPI app

Example backend env variables:

```env
DATABASE_URL=sqlite+aiosqlite:///./test.db
JWT_SECRET=your_jwt_secret
JWT_ALGORITHM=HS256
APP_EMAIL=your-email@example.com
EMAIL_PASSWORD=your-email-password
```

### 4. Frontend setup

1. Go to `frontend/`
2. Install Node dependencies:

```bash
npm install
```

3. Create a `frontend/.env` file with values such as:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

4. Start the frontend:

```bash
npm run dev
```

## Running the Project

- Start the backend service first
- Start the frontend dev server next
- Open the app in the browser and use the authentication flows

## Notes

- Do not commit `.env` files to source control
- The backend submodule is linked at `backend/`
- If you update the backend submodule, run `git submodule update --remote`

## Contact

For questions or improvements, edit this README or open an issue in the repository.
