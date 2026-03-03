# LinkedIn Clone - Full Stack Project

A microservices-based LinkedIn clone built with Java Spring Boot (backend) and React.js (frontend).

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Services](#services)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Frontend](#frontend)
8. [Project Structure](#project-structure)
9. [How to Run](#how-to-run)
10. [Session Notes](#session-notes)

---

## Project Overview

This is a full-stack LinkedIn clone with:
- **8 Microservices** for backend
- **React.js** frontend
- **MySQL** databases
- **Netflix Eureka** for service discovery
- **Spring Cloud Gateway** for API routing
- **REST APIs** for communication

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (React.js)                         │
│                         :3000                                    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API Gateway (Port 8080)                         │
└─────────────────────────┬───────────────────────────────────────┘
                          │
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
┌─────────────────┐ ┌───────────┐ ┌──────────────┐
│  Auth Service  │ │Post Service│ │Company-Job   │
│    :8086       │ │  :8082    │ │  Service     │
└────────┬────────┘ └─────┬────┘ │    :8083     │
         │               │       └──────┬───────┘
         │               │              │
         ▼               ▼              ▼
┌──────────────────────────────────────────────────────────────┐
│              Users Service (Port 8081)                         │
│              File Service (Port 8084)                           │
│              Chat Service (Port 8085)                          │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                    Netflix Eureka (Port 8761)                 │
└──────────────────────────────────────────────────────────────┘
```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (React.js)                         │
│                         :3000                                    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway / Services                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────┐ ┌───────────┐ ┌──────────────┐
│  Users Service  │ │Post Service│ │Company-Job   │
│    :8081        │ │  :8082    │ │  Service     │
└────────┬────────┘ └─────┬─────┘ │    :8083     │
         │                │       └──────┬───────┘
         │                │              │
         ▼                ▼              ▼
┌──────────────────────────────────────────────────────────────┐
│                    Netflix Eureka (Port 8761)                 │
└──────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.3.4**
- **Spring Cloud** (Eureka, OpenFeign)
- **Spring Data JPA**
- **MySQL 8**
- **Lombok**
- **JWT** for authentication
- **Maven**

### Frontend
- **React 18**
- **Vite** (build tool)
- **React Router v6**
- **Axios** (HTTP client)
- **React Icons**
- **React Toastify**
- **CSS** (custom LinkedIn-style)

---

## Services

### 1. Eureka Discovery Server (:8761)
Service registry for all microservices.

### 2. Gateway Service (:8080)
- API Gateway for routing requests
- Routes requests to appropriate microservices
- CORS configuration

### 3. Auth Service (:8086)
- User registration and login
- JWT token generation
- Password encryption with BCrypt

### 4. Users Service (:8081)
- User profiles
- Experiences
- File uploads (avatar, resume)
- Connections/Friends

**Entities:** User, UserInfo, Experience, UserFiles, Role

### 3. Post Service (:8082)
- Posts creation
- Comments on posts
- Likes on posts
- Post media files

**Entities:** Post, PostComment, PostLikes, PostFiles

### 4. Company-Job Service (:8083)
- Companies management
- Job postings
- Job applications
- Job categories

**Entities:** Company, Job, JobCategory, JobApplication

### 5. Chat Service (:8085)
- Chat conversations
- Messages
- Real-time messaging

**Entities:** Chat, ChatParticipant, Message

### 6. File Service (:8084)
- File uploads
- File management

---

## Database Schema

### users_service
```sql
-- User table
users (id, email, password, first_name, last_name, headline, bio, location, created_at)

-- User Info
user_infos (id, user_id, headline, bio, location, phone, website)

-- Experience
experiences (id, user_id, title, company, location, start_date, end_date, description)

-- User Files
user_files (id, user_id, type, url, created_at)

-- Roles
roles (id, name)
user_roles (user_id, role_id)
```

### post_service
```sql
-- Posts
posts (id, posted_by, title, description, posted_at)

-- Comments
post_comments (id, post_id, user_id, parent_id, text, posted_at)

-- Likes
post_likes (id, post_id, user_id)

-- Files
post_files (id, post_id, type, url)
```

### company_job_service
```sql
-- Companies
companies (id, name, description, industry, website, location, size, created_at)

-- Jobs
jobs (id, title, description, requirements, location, salary, job_type, company_id, category_id, created_at)

-- Categories
job_categories (id, name, description)

-- Applications
job_applications (id, job_id, user_id, applied_at, status)
```

### chat_service
```sql
-- Chats
chats (id, participant_id, last_message_at)

-- Messages
messages (id, chat_id, sender_id, content, created_at, is_deleted)
```

---

## API Endpoints

### Auth Service (Through Gateway)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login & get JWT |
| GET | /api/auth/validate | Validate JWT token |

### User Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users/profile | Get current user |
| PUT | /api/users | Update user |
| GET | /api/users/friends | Get connections |
| POST | /api/users/experiences | Add experience |
| GET | /api/users/experiences | Get experiences |
| POST | /api/users/upload | Upload file |

### Post Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/posts | Get all posts |
| POST | /api/posts | Create post |
| DELETE | /api/posts/{id} | Delete post |
| POST | /api/posts/comments | Add comment |
| GET | /api/posts/comments/post/{id} | Get comments |
| POST | /api/posts/likes | Like/unlike post |

### Company Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/company | Get all companies |
| POST | /api/company | Create company |
| GET | /api/company/{id} | Get company |
| PUT | /api/company/{id} | Update company |

### Job Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/jobs | Get all jobs |
| POST | /api/jobs | Create job |
| GET | /api/jobs/{id} | Get job |
| POST | /api/jobs/applied | Apply for job |
| GET | /api/jobs/company/{id} | Jobs by company |

### Chat Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/chats | Get all chats |
| POST | /api/chats | Create chat |
| GET | /api/chats/{id} | Get chat with messages |
| POST | /api/chats/messages | Send message |

### Category Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/category | Get all categories |
| POST | /api/category | Create category |

---

## Frontend

### Pages
- **Login** - User authentication
- **Register** - New user registration
- **Home** - News feed with posts
- **Profile** - User profile with experiences
- **Jobs** - Job listings
- **Companies** - Company directory
- **Network** - Connections
- **Chat** - Messaging

### Components
- Navbar - Navigation
- PostCard - Display posts
- CreatePost - Create new post modal
- Loading - Loading spinner

### API Integration
The frontend uses Axios with interceptors for JWT token handling.

---

## Project Structure

```
LinkedIn-Clone/
├── frontend/                          # React.js Frontend
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   ├── context/                  # Auth context
│   │   ├── pages/                    # Page components
│   │   ├── services/                # API services
│   │   ├── App.jsx                   # Main app
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Styles
│   ├── package.json
│   └── vite.config.js
│
├── auth-service/                      # Authentication Microservice
│   ├── src/main/java/.../
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── security/
│   │   └── config/
│   └── pom.xml
│
├── gateway-service/                    # API Gateway Microservice
│   ├── src/main/java/.../
│   │   ├── config/
│   │   └── filter/
│   └── pom.xml
│
├── users-service/                     # Users Microservice
│   ├── src/main/java/.../
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── validators/
│   │   └── config/
│   └── pom.xml
│
├── post-service/                      # Posts Microservice
│   ├── src/main/java/.../
│   └── pom.xml
│
├── company-job-service/               # Company & Jobs Microservice
│   ├── src/main/java/.../
│   └── pom.xml
│
├── chat-service/                      # Chat Microservice
│   ├── src/main/java/.../
│   └── pom.xml
│
├── file-service/                      # File Microservice
│   ├── src/main/java/.../
│   └── pom.xml
│
├── eureka-discovery-server/           # Service Registry
│   ├── src/main/java/.../
│   └── pom.xml
│
├── LinkedIn-Clone-API-Collection.json # Postman Collection
├── API-Documentation.md               # API Documentation
├── ARCHITECTURE.md                   # Architecture diagrams
└── README.md                          # Setup Documentation
```

---

## How to Run

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8
- Maven

### Backend

1. **Create MySQL Databases:**
```sql
CREATE DATABASE users_service;
CREATE DATABASE post_service;
CREATE DATABASE company_job_service;
CREATE DATABASE chat_service;
CREATE DATABASE file_service;
CREATE DATABASE auth_service;
```

2. **Update application.yml:**
Update database credentials in each service's `application.yml`

3. **Start Eureka Server:**
```bash
cd eureka-discovery-server
mvn spring-boot:run
```

4. **Start Microservices:**
```bash
cd auth-service && mvn spring-boot:run
cd gateway-service && mvn spring-boot:run
cd users-service && mvn spring-boot:run
cd post-service && mvn spring-boot:run
cd company-job-service && mvn spring-boot:run
cd chat-service && mvn spring-boot:run
cd file-service && mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:3000**

---

## Session Notes

### Changes Made in This Session:

1. **Created auth-service (Port 8086)**
   - Handles user registration and login
   - JWT token generation
   - Password encryption with BCrypt
   - Endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/validate`

2. **Created gateway-service (Port 8080)**
   - API Gateway for routing all requests
   - Routes:
     - `/api/auth/**` → auth-service:8086
     - `/api/users/**` → users-service:8081
     - `/api/posts/**` → post-service:8082
     - `/api/company/**`, `/api/jobs/**`, `/api/category/**` → company-job-service:8083
     - `/api/chats/**` → chat-service:8085
     - `/api/files/**` → file-service:8084

3. **Fixed users-service**
   - Added missing `@EnableFeignClients` annotation to enable Feign client support

4. **Created API Documentation**
   - `LinkedIn-Clone-API-Collection.json` - Postman collection
   - `API-Documentation.md` - Detailed API documentation

### Service Ports:
| Service | Port |
|---------|------|
| Gateway Service | 8080 |
| Auth Service | 8086 |
| Users Service | 8081 |
| Post Service | 8082 |
| Company-Job Service | 8083 |
| File Service | 8084 |
| Chat Service | 8085 |
| Eureka Server | 8761 |

### Important Notes:
- All requests should go through the gateway at port 8080
- Auth service handles JWT token generation
- Gateway routes requests based on path patterns
- Eureka must be running first for service discovery

---

## Key Features

- [x] API Gateway (Spring Cloud Gateway)
- [x] User Authentication (JWT + BCrypt)
- [x] Profile Management
- [x] Work Experience
- [x] Posts & Feed
- [x] Comments & Likes
- [x] Companies
- [x] Job Postings
- [x] Job Applications
- [x] Messaging/Chat
- [x] File Uploads
- [x] Service Discovery (Eureka)
- [x] REST APIs
- [x] Feign Client for inter-service communication

---

## Notes

- All services register with Eureka on startup
- JWT tokens are used for authentication
- Frontend proxies API calls to backend
- Each service has its own MySQL database
- APIs follow RESTful conventions
