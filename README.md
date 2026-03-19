# Secure Blog Platform

## Overview

Secure blogging platform that allows users to create and publish blog posts while also providing a public feed for readers to explore content.

The goal of this project is to demonstrate a clean architecture across both frontend and backend while implementing secure authentication, efficient database access, and scalable API design.

The platform supports authenticated blog management as well as public access to published articles through unique blog URLs and a public feed.


## Tech Stack

### Frontend

* **Next.js 15 (App Router)**
* **TypeScript**
* Component-based architecture
* Client/server rendering where appropriate

### Backend

* **NestJS**
* **TypeScript (strict mode)**
* **Prisma ORM**
* **PostgreSQL**

### Deployment

* Frontend: Vercel
* Backend: Railway
* Database: Neon PostgreSQL


## Core Features

### Authentication System

Users can:

* Register
* Login
* Access protected routes

Security features include:

* Password hashing using bcrypt
* JWT-based authentication
* NestJS guards for protected routes
* DTO validation for request data
* Secure API error handling


### Blog Management (Private Dashboard)

Authenticated users can manage their own blog posts.

Supported operations:

* Create blog post
* Edit blog post
* Delete blog post
* Publish or unpublish content

Each blog contains:

* title
* content
* slug (unique)
* publish status

Only the owner of a blog post can modify it.

---

### Public Blog Access

Published blogs are accessible publicly through their slug.

Example route:

/public/blogs/:slug

Features:

* Only published blogs are visible
* Clean 404 handling
* Minimal data exposure


### Public Feed

The platform includes a public feed displaying recently published blogs.

Features:

* Pagination
* Sorted by newest first
* Author information
* Like count
* Comment count

The feed is optimized using Prisma queries to avoid unnecessary database calls and reduce the chance of N+1 query problems.

Frontend route:

/feed

### Like System

Authenticated users can like blog posts.

Rules implemented:

* A user can like a post only once
* Database constraint prevents duplicate likes
* Like count updates immediately


### Comment System

Users can comment on blog posts.

Features:

* Input validation
* Author information returned with comments
* Sorted by newest first
* Indexed queries for performance


## Database Design

The database schema is designed with clear relationships between users, blogs, likes, and comments.

Main entities:

**User**

* id
* email (unique)
* passwordHash
* createdAt

**Blog**

* id
* userId
* title
* slug (unique)
* content
* summary
* isPublished
* createdAt
* updatedAt

**Like**

* id
* userId
* blogId
* createdAt

Unique constraint:

(userId, blogId)

**Comment**

* id
* blogId
* userId
* content
* createdAt

Indexes were added for commonly queried fields such as blogId and createdAt.

**Project Structure**

The project is organized as a monorepo containing separate frontend and backend applications.

secure-blog-platform
│
├── frontend
│   ├── app
│   ├── components
│   ├── hooks
│   └── services
│
├── backend
│   ├── src
│   │   ├── auth
│   │   ├── blogs
│   │   ├── users
│   │   └── common
│   │
│   └── prisma

This separation keeps concerns clear and makes both services independently deployable.

## Running the Project Locally

### Backend

cd backend
npm install
npx prisma migrate dev
npm run start:dev

Backend will run on:

http://localhost:3001

### Frontend

cd frontend
npm install
npm run dev

Frontend will run on:

http://localhost:3000

## Deployment

The application is deployed using separate services for each layer.

Frontend
Vercel handles static and server-side rendering for the Next.js application.

Backend
The NestJS API is deployed on Railway.

Database
PostgreSQL is hosted using Neon.

Architecture overview:

User
 ↓
Next.js (Vercel)
 ↓ API Requests
NestJS API (Railway)
 ↓
PostgreSQL Database (Neon)

## Tradeoffs

During development, the focus was placed on clean architecture and correct backend behavior rather than UI polish.

Some design decisions:

* Prisma was chosen for its strong type safety and developer experience.
* NestJS provides a structured backend architecture suitable for larger applications.
* Next.js App Router allows flexible rendering strategies.

Areas that could be improved with more time include UI design and deeper caching strategies.


## Scaling to 1 Million Users

To scale this system to a large user base, several improvements would be introduced:

* Redis caching for frequently accessed blog feeds
* CDN for static assets and images
* Background job queues for heavy tasks
* Horizontal scaling of the API using containers
* Read replicas for the database
* Rate limiting and API gateway protection

These changes would allow the platform to handle significantly higher traffic while maintaining performance.


## Future Improvements

Potential enhancements include:

* Background jobs for automatic blog summaries (AI Blog Analyzer deployed in Market Place)
* Real-time notifications for comments and likes
* Improved search and filtering for blog discovery


## Author

Thamizharasan R - 2315058 - IT - 3rd Year ,
National Engineering College - Kovilpatti
