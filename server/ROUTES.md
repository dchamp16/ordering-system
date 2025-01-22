# API Route Samples

## Table of Contents

- [Auth Routes](#auth-routes)
    - [Login](#login)
    - [Logout](#logout)
- [Order Routes](#order-routes)
    - [Create Order](#create-order)
    - [Get All Orders](#get-all-orders)
    - [Get Orders by Employee ID](#get-orders-by-employee-id)
    - [Update Order](#update-order)
- [Hardware Routes](#hardware-routes)
    - [Add Hardware](#add-hardware)
- [User Routes](#user-routes)
    - [Add User](#add-user)
- [Navigation](#navigation)

## Auth Routes

### Login

**POST** `/api/auth/login`

**Request Body:**

```json
{
  "username": "admin",
  "password": "adminpassword"
}
```

**Response:**

- **200 OK**

```json
{
  "message": "Login successful",
  "user": {
    "id": "64ef123abc",
    "username": "admin",
    "role": "admin"
  }
}
```

- **400 Bad Request**

```json
{
  "error": "Invalid credentials"
}
```

### Logout

**GET** `/api/auth/logout`

**Response:**

- **200 OK**

```json
{
  "message": "Logout successful"
}
```

---

## Order Routes

### Create Order

**POST** `/api/orders`

**Request Body:**

```json
{
  "empId": "12345",
  "empName": "Jane Doe",
  "structurePO": "PO123",
  "structureName": "Main Building",
  "orders": [
    {
      "hardwareOldNumber": "HW123",
      "quantity": 5
    }
  ]
}
```

**Response:**

- **201 Created**

```json
{
  "message": "Orders created successfully",
  "newOrder": {
    "empId": "12345",
    "empName": "Jane Doe",
    "structurePO": "PO123",
    "structureName": "Main Building",
    "orders": [
      {
        "hardwareOldNumber": "HW123",
        "quantity": 5,
        "status": "Pending"
      }
    ]
  }
}
```

- **404 Not Found** (When hardware is not available)

```json
{
  "error": "Hardware not found: HW123"
}
```

---

## Hardware Routes

### Add Hardware

**POST** `/api/hardware`

**Request Body:**

```json
{
  "hardwareOldNumber": "HW123",
  "hardwarePO": "PO12345",
  "hardwareGroupName": "Group1",
  "quantity": 100,
  "hardwareDescription": "Test hardware"
}
```

**Response:**

- **201 Created**

```json
{
  "message": "Hardware items added successfully",
  "result": {
    "_id": "64ef987xyz",
    "hardwareOldNumber": "HW123",
    "hardwarePO": "PO12345",
    "hardwareGroupName": "Group1",
    "quantity": 100,
    "hardwareDescription": "Test hardware"
  }
}
```

---

## Navigation

Return to the [Main README](./README.md).
