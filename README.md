# Recovery Center React Application

A modern web application for managing lost and found items with role-based access control, designed to work with the Recovery Center Spring Boot backend.

## Tech Stack

-   **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, React Router
-   **Backend**: Spring Boot (Java 17), MySQL 8.0+, JWT Authentication

## Features

-   **Authentication**: JWT-based login/registration with role-based access (USER, STAFF, ADMIN)
-   **Item Management**: Add, edit, delete items with status tracking (LOST, FOUND, CLAIMED)
-   **Request System**: Submit, approve/reject requests with admin notes and status tracking
-   **User Management**: Admin can manage users and roles
-   **Security**: BCrypt encryption, CORS configuration, comprehensive error handling

## Setup

### Frontend

```bash
git clone <repository-url>
cd recovery-center-app-react
npm install
npm run dev
```

### Backend Requirements

-   Java 17+, MySQL 8.0+, Maven 3.6+
-   Create database: `recovery_center_db`
-   Default API endpoint: `http://localhost:8080`

## Usage

1. Register/Login with your account
2. Browse and manage lost/found items
3. Submit requests for items
4. Admins can manage users and approve requests

## User Roles

-   **USER**: Browse items, submit requests, add found items
-   **STAFF**: User permissions + approve/reject requests
-   **ADMIN**: All permissions + user management

## API Endpoints

-   Authentication: `/api/v1/auth/*`
-   Items: `/api/v1/items`
-   Requests: `/api/v1/requests`
-   Users: `/api/v1/users` (admin only)

API documentation: `http://localhost:8080/swagger-ui.html`
