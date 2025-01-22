# Ordering System API

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Directory Structure](#directory-structure)
- [Setup](#setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [API Endpoints](#api-endpoints)
    - [View Route Samples](#view-route-samples)
- [To-Do](#to-do)
- [License](#license)

## Overview

The Ordering System API is a Node.js-based application for managing orders, hardware inventory, and user roles. It
provides robust endpoints for creating, updating, and retrieving orders, managing hardware data, and maintaining audit
logs for transparency.

## Features

- Role-based access control for Admin and Super Admin roles.
- CRUD operations for orders, hardware, and users.
- Audit logs to track system actions.
- Excel file upload for bulk hardware data addition.
- Validation using Joi for data integrity.

## Directory Structure

```
├── .env
├── config/
│   ├── database.js
├── controllers/
│   ├── authController.js
│   ├── excelController.js
│   ├── hardwareController.js
│   ├── orderController.js
│   ├── userController.js
├── middleware/
│   ├── auth.js
├── models/
│   ├── auditLogModel.js
│   ├── hardwareModel.js
│   ├── orderModel.js
│   ├── structureModel.js
│   ├── userModel.js
├── routes/
│   ├── adminRoutes.js
│   ├── auditLogRoutes.js
│   ├── authRoutes.js
│   ├── hardwareRoutes.js
│   ├── orderRoutes.js
│   ├── userRoutes.js
├── server.js
├── uploads/
├── package.json
```

## Setup

### Prerequisites

- Node.js (v14 or later)
- MongoDB instance (local or cloud-based)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/ordering-system.git
   ```

2. Navigate to the server directory:

   ```bash
   cd ordering-system/server
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the `server` directory with the following content:

   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   SESSION_SECRET=<your-secret>
   ```

5. Start the server:

   ```bash
   node server.js
   ```

The server will be accessible at `http://localhost:5000`.

## API Endpoints

### View Route Samples

For detailed route examples, visit the [Route Samples](./ROUTES.md).

## To-Do

- Add Swagger documentation for API endpoints.
- Implement rate-limiting for security.
- Enhance test coverage with Jest and Supertest.

## License

This project is licensed under the MIT License.
