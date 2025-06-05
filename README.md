# Recovery Center React Application

A modern web application for managing lost and found items with role-based access control and comprehensive request management, designed to work with the Recovery Center Spring Boot backend.

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Heroicons (SVG)
- **Backend**: Spring Boot (Java 17)
- **Database**: MySQL 8.0+
- **Authentication**: JWT with BCrypt password encryption

## ✨ Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication with token management
- Role-based access control (USER, STAFF, ADMIN)
- Secure BCrypt password encryption

### Item Management
- Add, edit, delete, and view lost/found items
- Item status tracking (LOST, FOUND, CLAIMED)
- Detailed item information with descriptions
- Real-time status tracking through the complete workflow

### Request System
- Users can submit requests for items
- Staff/Admin can approve or reject requests
- Mandatory admin notes for request decisions
- Request status tracking (PENDING, APPROVED, REJECTED)
- Transaction management for data consistency

### User Management (Admin Only)
- View all users
- Update user roles
- Delete users
- User search and filtering

### UI/UX
- Responsive design with mobile-friendly interfaces
- Modern and clean interface with Tailwind CSS
- Loading states and error handling
- Professional modal dialogs
- Intuitive navigation and workflows

### Security Features
- JWT token-based authentication
- Role-based authorization
- CORS configuration for cross-origin requests
- Comprehensive error handling and logging

## 🚀 Setup Instructions

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recovery-center-app-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Backend Integration

The frontend is designed to work with the Recovery Center Spring Boot backend:

1. **System Requirements**
   - Java 17 or higher
   - MySQL 8.0+
   - Maven 3.6+ (or use included Maven wrapper)

2. **Database Setup**
   ```sql
   CREATE DATABASE recovery_center_db;
   CREATE USER 'myuser'@'localhost' IDENTIFIED BY 'mypassword';
   GRANT ALL PRIVILEGES ON recovery_center_db.* TO 'myuser'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Update Backend API Configuration**
   - Ensure the Spring Boot application is running
   - Default endpoint: `http://localhost:8080`
   - API documentation available at: `/swagger-ui.html`

## 🔧 Configuration

- Update API base URL in `src/services/api.ts` if needed
- Backend API should be running on the configured endpoint
- Ensure CORS is properly configured on the backend
- JWT configuration details in the backend application properties

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Browse Items**: View all lost and found items
3. **Submit Requests**: Request items you believe are yours
4. **Manage Items**: Add items you've found (authenticated users)
5. **Admin Functions**: Manage users and approve requests (admin only)

## 🎯 User Roles

- **USER**: Can browse items, submit requests, and add found items
- **STAFF**: All user permissions + approve/reject requests and manage items
- **ADMIN**: All permissions + user management and system configuration

## 🔗 API Integration

This frontend integrates with a Spring Boot backend API with these key endpoints:

- **Authentication**: `/api/v1/auth/login`, `/api/v1/auth/signup`
- **Items**: `/api/v1/items`
- **Requests**: `/api/v1/requests`
- **Users**: `/api/v1/users` (admin only)

For complete API documentation, visit the Swagger UI at `http://localhost:8080/swagger-ui.html` when running the backend.

## 🔍 Database Schema

The application uses these main data models:

- **Users**: Account information, roles, and authentication details
- **Items**: Lost or found item records with tracking information
- **Requests**: Claim requests linking users to items

## 🧩 Project Structure

- `/src/components`: Reusable UI components
- `/src/contexts`: React Context providers including AuthContext
- `/src/pages`: Page components for each route
- `/src/services`: API client and service functions
- `/src/types`: TypeScript type definitions
