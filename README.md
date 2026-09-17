# WorkWave – Job Portal

WorkWave is a full-stack job portal built with **Spring Boot** that connects job seekers with recruiters. The application provides authentication, job management, job applications, and role-based access control.

## Features

* User and recruiter authentication using JWT
* Google OAuth2 login
* Role-based authorization for Users and Recruiters
* Recruiters can create, update, view, and delete job postings
* Users can browse available jobs and apply for jobs
* Job application management
* PostgreSQL for persistent data storage
* Secure REST APIs using Spring Security
* Redis-based OTP verification for registration
* Email-based OTP delivery

## Tech Stack

**Backend**

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Spring OAuth2 Client
* JWT
* Redis
* JavaMailSender

**Database & Storage**

* PostgreSQL
* Redis

**Tools**

* Maven
* Git
* Postman

## Architecture

```text
                ┌─────────────────┐
                │    Frontend     │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Spring Boot    │
                │   REST API      │
                └───────┬─────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
    PostgreSQL        Redis       Google OAuth2
          │             │
          │             └── OTP / Temporary User
          │
          └── Users / Jobs / Applications
```

## Authentication Flow

### Email Registration

```text
User
 │
 ├── Register
 │
 ▼
Spring Boot
 │
 ├── Generate OTP
 ├── Store OTP in Redis
 ├── Store temporary user data in Redis
 └── Send OTP through email
 │
 ▼
User verifies OTP
 │
 ▼
User saved in PostgreSQL
```

### Login

```text
User
 │
 ▼
Login API
 │
 ▼
Spring Security
 │
 ├── Validate credentials
 │
 ▼
JWT generated
 │
 ▼
Client uses JWT for protected APIs
```

## API Endpoints

### Authentication

| Method | Endpoint                       | Description             |
| ------ | ------------------------------ | ----------------------- |
| POST   | `/api/auth/register`           | Register a new user     |
| POST   | `/api/auth/verify-otp`         | Verify registration OTP |
| POST   | `/api/auth/login`              | Login user              |
| GET    | `/oauth2/authorization/google` | Google OAuth2 login     |

### Jobs

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | `/api/jobs`      | Create a job  |
| GET    | `/api/jobs`      | Get all jobs  |
| GET    | `/api/jobs/{id}` | Get job by ID |
| PUT    | `/api/jobs/{id}` | Update job    |
| DELETE | `/api/jobs/{id}` | Delete job    |

### Applications

Application APIs handle job applications submitted by authenticated users and provide access based on the user's role.

## Security

WorkWave uses **Spring Security** with JWT-based authentication.

Protected resources are controlled using roles:

```text
USER
 └── Job applications

RECRUITER
 └── Job management
```

Public authentication endpoints are exposed under:

```text
/api/auth/**
```

JWT tokens are validated through a custom security filter before protected requests reach the application.

## Redis Usage

Redis is used during the registration process for temporary authentication data.

```text
OTP
 └── TTL: 5 minutes

TEMP_USER:{email}
 └── Temporary registration data
```

This prevents unverified users from being directly stored in PostgreSQL.

## Database

PostgreSQL stores the application's persistent data, including:

* Users
* Jobs
* Job applications
* User roles

JPA/Hibernate is used for object-relational mapping.

## Project Structure

```text
WorkWave/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ...
│   │   └── resources/
│   │       └── application.yml
│   └── test/
│
├── pom.xml
└── README.md
```

The backend is organized around controllers, services, repositories, entities, DTOs, security components, and configuration classes.

## Configuration

Configure the following values in `application.yml` or environment variables:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/workwave
    username: YOUR_USERNAME
    password: YOUR_PASSWORD

  data:
    redis:
      host: localhost
      port: 6379
```

For email and Google OAuth2, configure the required credentials separately.

## Running Locally

### Prerequisites

* Java 17+
* Maven
* PostgreSQL
* Redis

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/WorkWave.git
cd WorkWave
```

### 2. Create the database

Create a PostgreSQL database named:

```text
workwave
```

### 3. Start Redis

If Redis is installed locally:

```bash
redis-server
```

Or run it using Docker:

```bash
docker run -d -p 6379:6379 --name workwave-redis redis
```

### 4. Configure application properties

Add your PostgreSQL, Redis, email, JWT, and Google OAuth2 configuration.

### 5. Start the application

```bash
mvn spring-boot:run
```

The backend will start on the configured Spring Boot port.

## Request Flow

A typical job application flow is:

```text
Recruiter
   │
   ▼
Create Job
   │
   ▼
PostgreSQL
   │
   ▼
Job becomes available
   │
   ▼
User browses jobs
   │
   ▼
User applies
   │
   ▼
Application stored in PostgreSQL
```

## Future Improvements

* Resume upload and parsing
* Job search and filtering
* Pagination
* Recruiter dashboard
* User profile management
* Application status tracking
* Notifications
* Dockerized deployment
* CI/CD pipeline
* Cloud deployment

## License

This project is intended for learning and portfolio purposes.
