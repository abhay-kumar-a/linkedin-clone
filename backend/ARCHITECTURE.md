# LinkedIn Clone - Architecture Diagram

## High-Level System Architecture

```mermaid
flowchart TB
    subgraph Client["👥 Client Layer"]
        Mobile["Mobile App"]
        Web["Web App"]
    end

    subgraph Gateway["🚀 API Gateway / Load Balancer"]
        Gateway["Spring Cloud Gateway / Nginx"]
    end

    subgraph Discovery["🔍 Service Discovery"]
        Eureka["Netflix Eureka\nService Registry"]
    end

    subgraph Services["☁️ Microservices"]
        Auth["Auth Service\n🔐\n• Register\n• Login\n• JWT Token"]
        User["User Service\n👤\n• Profiles\n• Experiences\n• Connections"]
        Post["Post Service\n📝\n• Posts\n• Comments\n• Likes"]
        Company["Company-Job Service\n🏢\n• Companies\n• Jobs\n• Applications"]
        Chat["Chat Service\n💬\n• Messages\n• Chats"]
        File["File Service\n📁\n• Upload\n• Download"]
    end

    subgraph Database["🗄️ Databases"]
        AuthDB[(Auth DB\nMySQL)]
        UserDB[(User DB\nMySQL)]
        PostDB[(Post DB\nMySQL)]
        CompanyDB[(Company DB\nMySQL)]
        ChatDB[(Chat DB\nMongoDB)]
        FileDB[(File Storage\nMinIO/S3)]
    end

    subgraph Monitoring["📊 Monitoring & Config"]
        Config["Spring Config\nServer"]
        Zipkin["Zipkin\nDistributed Tracing"]
    end

    %% Client to Gateway
    Mobile --> Gateway
    Web --> Gateway

    %% Gateway to Services
    Gateway --> Auth
    Gateway --> User
    Gateway --> Post
    Gateway --> Company
    Gateway --> Chat
    Gateway --> File

    %% Services to Eureka
    Auth --> Eureka
    User --> Eureka
    Post --> Eureka
    Company --> Eureka
    Chat --> Eureka
    File --> Eureka

    %% Services to Databases
    Auth --> AuthDB
    User --> UserDB
    Post --> PostDB
    Company --> CompanyDB
    Chat --> ChatDB
    File --> FileDB

    %% Services to Config
    Auth --> Config
    User --> Config
    Post --> Config
    Company --> Config
    Chat --> Config
    File --> Config
```

---

## Service Communication Flow

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant Eureka
    participant Auth
    participant User
    participant Database

    Client->>Gateway: 1. Request (POST /api/users/profile)
    Gateway->>Eureka: 2. Lookup "users-service"
    Eureka-->>Gateway: 3. Return Service URL
    Gateway->>Auth: 4. Validate JWT Token
    Auth-->>Gateway: 5. Token Valid ✓
    Gateway->>User: 6. Forward Request
    User->>Database: 7. Query User Profile
    Database-->>User: 8. Return Data
    User-->>Gateway: 9. Response
    Gateway-->>Client: 10. JSON Response
```

---

## Microservices Breakdown

```mermaid
graph TD
    subgraph "Auth Service"
        AuthController["AuthController"]
        AuthService["AuthService"]
        AuthRepo["UserRepository"]
        JwtUtil["JWT Utils"]
    end

    subgraph "User Service"
        UserController["UserController"]
        UserService["UserService"]
        UserRepo["UserRepository"]
        ExperienceController["ExperienceController"]
    end

    subgraph "Post Service"
        PostController["PostController"]
        PostService["PostService"]
        CommentController["CommentController"]
        LikeService["LikeService"]
    end

    subgraph "Company-Job Service"
        CompanyController["CompanyController"]
        JobController["JobController"]
        ApplicationController["ApplicationController"]
    end
```

---

## Technology Stack

```mermaid
graph LR
    Frontend["Frontend\n• React\n• React Native\n• Next.js"] 
    Backend["Backend\n• Java 17\n• Spring Boot 3\n• Spring Cloud"] 
    Database["Databases\n• MySQL 8\n• MongoDB\n• Redis"] 
    Infrastructure["Infrastructure\n• Docker\n• Kubernetes\n• Eureka\n• Config Server"] 
    Tools["Tools\n• Maven\n• Jenkins\n• Zipkin\n• Lombok"] 

    Frontend --> Backend
    Backend --> Database
    Backend --> Infrastructure
    Infrastructure --> Tools
```

---

## Key Design Patterns Used

```mermaid
flowchart LR
    subgraph "Design Patterns"
        API_Gateway["API Gateway\nPattern"]
        Service_Registry["Service Registry\nPattern"]
        Circuit_Breaker["Circuit Breaker\nPattern"]
        Database_Per_Service["Database per\nService"]
        Event_Driven["Event-Driven\nArchitecture"]
        CQRS["CQRS\nPattern"]
    end
```

---

## Interview Talking Points

### 1. **Why Microservices?**
- ✅ Independent deployment
- ✅ Scalability per service
- ✅ Technology flexibility
- ✅ Fault isolation

### 2. **Service Discovery**
- Netflix Eureka for dynamic service registration
- Services register on startup, deregister on shutdown
- Client-side load balancing with Ribbon

### 3. **API Gateway**
- Single entry point for all clients
- Authentication/Authorization
- Request routing, rate limiting

### 4. **Inter-Service Communication**
- REST APIs for synchronous communication
- Can use Kafka/RabbitMQ for async (event-driven)

### 5. **Database Strategy**
- Each service has its own database
- No shared databases = loose coupling
- Polyglot persistence (MySQL, MongoDB)

### 6. **Security**
- JWT tokens for authentication
- Token validation at API Gateway
- Role-based access control (RBAC)

### 7. **Configuration Management**
- Spring Cloud Config Server
- Centralized configuration
- Environment-specific configs
