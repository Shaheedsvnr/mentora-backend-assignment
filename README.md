# Mentora Backend Assignment

Node.js • Express • MongoDB • JWT • Gemini API

Backend implementation of a simplified **Mentorship Platform** where **Parents, Students, and Mentors** interact.

This project was built as part of the **Mentora Backend Developer technical assignment**.
It demonstrates backend architecture including **authentication, role-based access control, lesson management, session management, booking logic, and LLM-powered text summarization**.

---

# Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JSON Web Token (JWT)
- bcrypt password hashing

### LLM Integration

- Google Gemini API

### Security & Middleware

- helmet
- cors
- express-rate-limit

---

# Features Implemented

## Authentication System

- Parent and Mentor signup
- Secure login with JWT authentication
- Authenticated profile endpoint (`/auth/me`)

**Access Rules**

- Only **Parents** and **Mentors** can register
- **Students cannot register directly**
- Students are created by parents

---

## Parent → Student Management

Parents can:

- Create student accounts
- Retrieve all students under their profile

Each student record is linked to a **parentId**.

---

## Mentor → Lesson Management

Mentors can:

- Create lessons
- Manage lesson content

Each lesson is associated with a **mentorId**.

---

## Booking System

Parents can assign a **student to a lesson**.

This represents a student attending a mentor's lesson.

---

## Lesson Sessions

Mentors can create sessions inside lessons.

Each session includes:

- Date
- Topic
- Summary

Users can retrieve all sessions belonging to a lesson.

---

## LLM Text Summarization (Required Feature)

### Endpoint

POST `/llm/summarize`

This endpoint integrates with Google Gemini models and automatically falls back to alternative models if one fails.

### Summary Format

- 3–6 bullet points
- Maximum ~120 words

### Validation Rules

- Text is required
- Minimum length: **50 characters**
- Maximum length: **8000 characters**

### Protection Measures

- Rate limiting: **10 requests per minute**
- API keys stored securely using environment variables

---

# Project Structure

```
mentora-backend-assignment
│
├── config
│   └── db.js
│
├── controllers
│   ├── auth.controller.js
│   ├── student.controller.js
│   ├── lesson.controller.js
│   ├── session.controller.js
│   ├── booking.controller.js
│   └── llm.controller.js
│
├── middleware
│   ├── auth.middleware.js
│   └── role.middleware.js
│
├── models
│   ├── user.model.js
│   ├── student.model.js
│   ├── lesson.model.js
│   ├── session.model.js
│   └── booking.model.js
│
├── routes
│   ├── auth.routes.js
│   ├── student.routes.js
│   ├── lesson.routes.js
│   ├── session.routes.js
│   ├── booking.routes.js
│   └── llm.routes.js
│
├── .env.example
├── server.js
└── README.md
```

---

# Environment Variables

Create a `.env` file in the root directory.

Example configuration:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mentora
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

For security reasons, **API keys are not included in the repository**.

---

# Installation

Clone the repository

```
git clone https://github.com/Shaheedsvnr/mentora-backend-assignment.git
```

Navigate into the project folder

```
cd mentora-backend-assignment
```

Install dependencies

```
npm install
```

---

# Running the Server

This project uses **nodemon** during development to automatically restart the server when files change.

If nodemon is installed globally:

```
nodemon server.js
```

If nodemon is not installed globally:

```
npx nodemon server.js
```

Server will start at:

```
http://localhost:5000
```

Expected response:

```
Mentora Backend API is running
```

---

# API Testing

The API can be tested using:

- Postman
- Thunder Client
- curl
- Insomnia

Base URL:

```
http://localhost:5000
```

## Authentication Header

Some endpoints are **protected** and require a JWT token in the request headers.

Header format:

```
auth-token: <JWT_TOKEN>
```

You will receive the JWT token after a successful login using:

```
POST /auth/login
```

Example request to a protected endpoint:

```
GET /students
```

Headers:

```
auth-token: YOUR_JWT_TOKEN
```

---

# Authentication APIs

| Method | Endpoint     | Access        | Description                  |
| ------ | ------------ | ------------- | ---------------------------- |
| POST   | /auth/signup | Public        | Register a parent or mentor  |
| POST   | /auth/login  | Public        | Authenticate and receive JWT |
| GET    | /auth/me     | Authenticated | Retrieve logged-in user      |

Example signup request:

```
POST /auth/signup
```

```
{
  "name": "John",
  "email": "john@test.com",
  "password": "password123",
  "role": "parent"
}
```

# Example Testing Flow

1. Register a parent using /auth/signup
2. Login using /auth/login to receive a JWT token
3. Use the JWT token in the auth-token header
4. Create students using /students
5. Login as a mentor to create lessons
6. Assign students to lessons using /bookings
7. Create lesson sessions
8. Test text summarization using /llm/summarize

---

# Student APIs

Accessible **only by parents**.

| Method | Endpoint  | Description                |
| ------ | --------- | -------------------------- |
| POST   | /students | Create a student           |
| GET    | /students | Retrieve parent's students |

Example:

```
POST /students
```

```
{
  "name": "Ali",
  "age": 12
}
```

---

# Lesson APIs

Accessible **only by mentors**.

| Method | Endpoint |
| ------ | -------- |
| POST   | /lessons |

Example:

```
{
  "title": "Math Fundamentals",
  "description": "Basic mathematics course"
}
```

---

# Booking APIs

Parents assign a **student to a lesson**.

| Method | Endpoint  |
| ------ | --------- |
| POST   | /bookings |

Example request:

```
{
  "studentId": "STUDENT_ID",
  "lessonId": "LESSON_ID"
}
```

---

# Session APIs

Mentors can create sessions within lessons.

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /sessions             |
| GET    | /lessons/:id/sessions |

Example session creation:

```
{
  "lessonId": "LESSON_ID",
  "date": "2026-03-10",
  "topic": "Algebra",
  "summary": "Introduction to algebra"
}
```

---

# LLM Summarization API

Endpoint

```
POST /llm/summarize
```

Example request

```
{
  "text": "Artificial intelligence is transforming industries across the world..."
}
```

Example curl request

```
curl -X POST http://localhost:5000/llm/summarize \
-H "Content-Type: application/json" \
-d '{"text":"Artificial intelligence is transforming industries across the world..."}'
```

Example response

```
{
  "success": true,
  "summary": "• Point one\n• Point two\n• Point three",
  "model": "gemini-2.5-flash"
}
```

---

# Security Considerations

- Passwords securely hashed using **bcrypt**
- JWT-based authentication
- Role-based authorization middleware
- API rate limiting to prevent abuse
- Helmet security headers
- Environment variables for secret keys

---

# Assumptions

- Students are created only by parents
- Lessons are created only by mentors
- Parents assign students to lessons
- Sessions belong to lessons and are created by mentors
- LLM input text is limited to **8000 characters**

---

# Potential Improvements

Future improvements could include:

- Pagination for large datasets
- Advanced validation using Joi or Zod
- Refresh token authentication
- Automated unit and integration tests
- API documentation using Swagger / OpenAPI
- Docker-based deployment

---

# Author

Mahammad Shaheed M
Backend Developer Candidate – Mentora Technical Assignment
