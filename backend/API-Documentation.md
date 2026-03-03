# LinkedIn Clone - API Documentation

## Base URLs

| Service | Port | Base URL |
|---------|------|----------|
| Users Service | 8081 | http://localhost:8081 |
| Post Service | 8082 | http://localhost:8082 |
| Company-Job Service | 8083 | http://localhost:8083 |
| File Service | 8084 | http://localhost:8084 |
| Chat Service | 8085 | http://localhost:8085 |
| Eureka Server | 8761 | http://localhost:8761 |

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Users Service (Port 8081)

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |

#### Register Request Body
```json
{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login Request Body
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users/profile | Get current user profile |
| GET | /api/users/profile/{id} | Get user profile by ID |
| PUT | /api/users | Update user profile |
| GET | /api/users | Get all users (admin) |
| GET | /api/users/{id} | Get user by ID |
| DELETE | /api/users/{id} | Delete user (admin) |
| GET | /api/users/friends | Get user connections |
| POST | /api/users/upload | Upload user file |
| GET | /api/users/files | Get all user files |
| GET | /api/users/files/{type} | Get user file by type |
| GET | /api/users/resumes | Get user resumes |

### Experience Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users/experiences | Create experience |
| GET | /api/users/experiences | Get all experiences |
| GET | /api/users/experiences/{id} | Get experience by ID |
| PUT | /api/users/experiences/{id} | Update experience |
| DELETE | /api/users/experiences/{id} | Delete experience |

#### Create Experience Request Body
```json
{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "startDate": "2023-01-01",
  "endDate": "2024-12-31",
  "description": "Developing web applications"
}
```

---

## Post Service (Port 8082)

### Post Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/posts | Create new post |
| GET | /api/posts | Get all posts |
| GET | /api/posts/{id} | Get post by ID |
| DELETE | /api/posts/{id} | Delete post |
| POST | /api/posts/upload | Upload post file |

#### Create Post Request Body
```json
{
  "title": "My First Post",
  "description": "This is my first post!"
}
```

### Comment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/posts/comments | Add comment |
| GET | /api/posts/comments/{id} | Get comment by ID |
| GET | /api/posts/comments/post/{id} | Get comments for post |
| GET | /api/posts/comments/replies/{id} | Get reply comments |
| DELETE | /api/posts/comments/{id} | Delete comment |

#### Add Comment Request Body
```json
{
  "postId": 1,
  "text": "Great post!"
}
```

### Like Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/posts/likes | Like a post |

#### Like Post Request Body
```json
{
  "postId": 1
}
```

---

## Company-Job Service (Port 8083)

### Company Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/company | Create company |
| GET | /api/company | Get all companies |
| GET | /api/company/{id} | Get company by ID |
| GET | /api/company/detailed/{id} | Get company with jobs |
| PUT | /api/company/{id} | Update company |
| DELETE | /api/company/{id} | Delete company |

#### Create Company Request Body
```json
{
  "name": "Tech Corp",
  "description": "A leading technology company",
  "industry": "Technology",
  "website": "https://techcorp.com",
  "location": "San Francisco, CA",
  "size": "1000-5000"
}
```

### Job Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/jobs | Create job |
| GET | /api/jobs | Get all jobs |
| GET | /api/jobs/{id} | Get job by ID |
| GET | /api/jobs/detailed/{id} | Get job with company |
| GET | /api/jobs/company/{id} | Get jobs by company |
| GET | /api/jobs/category/{id} | Get jobs by category |
| GET | /api/jobs/sorted/{sortType} | Get jobs sorted |
| PUT | /api/jobs/{id} | Update job |
| DELETE | /api/jobs/{id} | Delete job |
| POST | /api/jobs/applied | Apply for job |

#### Create Job Request Body
```json
{
  "title": "Software Engineer",
  "description": "We are looking for a software engineer",
  "requirements": "3+ years experience",
  "location": "San Francisco, CA",
  "salary": 120000,
  "jobType": "FULL_TIME",
  "companyId": 1,
  "categoryId": 1
}
```

#### Apply for Job Request Body
```json
{
  "jobId": 1
}
```

### Category Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/category | Create category |
| GET | /api/category | Get all categories |
| GET | /api/category/{id} | Get category by ID |
| PUT | /api/category/{id} | Update category |
| DELETE | /api/category/{id} | Delete category |

---

## Chat Service (Port 8085)

### Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/chats | Create new chat |
| GET | /api/chats | Get all user chats |
| GET | /api/chats/{id} | Get chat with messages |
| DELETE | /api/chats/{id} | Delete chat |

#### Create Chat Request Body
```json
{
  "participantId": 2,
  "userId": 1
}
```

### Message Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/chats/messages | Send message |
| PUT | /api/chats/messages/{id} | Update message |
| DELETE | /api/chats/messages/{id} | Delete message |

#### Send Message Request Body
```json
{
  "chatId": 1,
  "content": "Hello! How are you?"
}
```

---

## File Service (Port 8084)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/files | Upload file |
| DELETE | /api/files/{id} | Delete file |
| POST | /api/files/batch-delete | Batch delete files |

#### Batch Delete Request Body
```json
{
  "fileIds": ["file-id-1", "file-id-2"]
}
```

---

## Eureka Discovery Server (Port 8761)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Eureka Dashboard |
| GET | /eureka/apps | Get all registered services |

---

## Postman Collection

Import the `LinkedIn-Clone-API-Collection.json` file into Postman to get all endpoints with pre-configured requests.

### Importing the Collection

1. Open Postman
2. Click "Import" button
3. Select the `LinkedIn-Clone-API-Collection.json` file
4. The collection will be imported with all endpoints

### Setting Up Variables

After importing, set the following variables in Postman:

- `baseUrl`: http://localhost:8081
- `authToken`: Your JWT token (after login)

---

## Error Responses

All endpoints may return the following error responses:

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Notes

- All dates should be in ISO format (YYYY-MM-DD)
- File uploads use multipart/form-data
- Chat and Job services use X-User-Id header instead of JWT for user identification
- Eureka must be running for service discovery to work
