

# Vehicle Service Reservation Web Application

A Node.js app for managing vehicle service reservations with Auth0 authentication and MySQL database integration.

## Features

- User authentication via Auth0
- Vehicle reservation management
- Secure session handling
- MySQL database

## Setup

### Requirements

- Node.js
- MySQL
- Git

### Environment Variables

Create a `.env` file in the root with:

```bash
PORT=3000
SESSION_SECRET=your_random_secret_string
DB_HOST=your_db_host
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=vehicle_service_reservation_db
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_DOMAIN=your_auth0_domain
BASE_URL=http://localhost:3000
```

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/your-github-username/vehicle-service-reservation.git
   cd vehicle-service-reservation
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the app:

   ```bash
   npm start
   ```

## Database

Set up MySQL with tables for `users`, `vehicles`, `services`, and `reservations`. Example SQL for table creation:

```sql
CREATE DATABASE vehicle_service_reservation_db;
USE vehicle_service_reservation_db;

-- Users table
CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE);

-- Add tables for vehicles, services, and reservations...
```

## Deployment

- Ensure `.env` is configured for production
- Deploy to AWS, Heroku, etc.

### Note: Sensitive Data

Ensure no sensitive data (e.g., DB credentials, Auth0 secrets) is committed. Add `.env` to `.gitignore` and follow best practices to remove secrets from history if needed.

