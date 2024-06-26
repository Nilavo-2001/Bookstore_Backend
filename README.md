---

# Bookstore Backend API

## Demo Link

Check out the live demo: [Bookstore Backend API Demo](https://www.youtube.com/watch?v=ASLFEDNB0jo)

## Overview

This project is a RESTful backend API for a bookstore application. It allows sellers to manage their books and buyers to view books. The application supports buyer and seller registration, authentication, and authorization using JWT. Sellers can upload books via CSV, view, edit, and delete their books, while buyers can view details of available books.

## Features

- **Buyer and Seller Registration:** Buyers and sellers can sign up with a name, email, and password.
- **Login:** Both Buyers and sellers can log in using their email and password.
- **JWT Authentication:** Secure authentication using JSON Web Tokens (JWT).
- **Book Management:** Sellers can upload, view, edit, and delete books.
- **CSV Upload:** Sellers can add multiple books by uploading a CSV file.
- **Authorization:** Sellers can only manage their own books.
- **Book Viewing:** Buyers can view all books and details of a specific book.

## Technologies Used

- **Node.js**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL**
- **Multer**
- **JWT**
- **JavaScript**

## Prerequisites

- Node.js
- PostgreSQL
- Prisma CLI
- Environment variables configured (.env file)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Nilavo-2001/Bookstore_Backend.git
   cd bookstore-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the database:**

   - Create a free account on neon.tech.
   - Create a new postgres database for the project.
   - Configure your `.env` file with the database connection details.

4. **Set up Prisma:**

   ```bash
   npx prisma init
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run the application:**
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
```

## API Endpoints

### Authentication

- **Register (Buyer/Seller)**

  - `POST /api/auth/signup`
  - Request Body: `{ "name": "string", "email": "string", "password": "string", confirmpassword:"string", "role": "buyer|seller" }`
  - Description: Registers a new buyer or seller.

- **Login (Buyer/Seller)**
  - `POST /api/auth/login`
  - Request Body: `{ "email": "string", "password": "string" }`
  - Description: Logs in a buyer or seller and returns a JWT token.

### Books

#### Buyer Endpoints

- **View All Books**

  - `GET /api/books/buyer`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Description: Retrieves a list of all books available in the database.

- **View Book Details**
  - `GET /api/books/buyer/:id`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Description: Retrieves details of a specific book by its ID.

#### Seller Endpoints

- **Upload Books (CSV)**

  - `POST /api/books/seller/upload`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Form Data: `{ "file": "<CSV file>" }`
  - Description: Allows sellers to upload a CSV file to add multiple books to the database.

- **View All Books**

  - `GET /api/books/seller`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Description: Retrieves a list of all books uploaded by the authenticated seller.

- **View Book Details**

  - `GET /api/books/seller/:id`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Description: Retrieves details of a specific book uploaded by the authenticated seller.

- **Update Book**

  - `PUT /api/books/seller/:id`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Request Body: `{ "title": "string", "author": "string", "price": "number" , publishedDate:"DateTime" }`
  - Description: Allows the authenticated seller to update details of a specific book they uploaded.

- **Delete Book**
  - `DELETE /api/books/seller/:id`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Description: Allows the authenticated seller to delete a specific book they uploaded.

### Middleware

- **authenticateBuyer**

  - Middleware to authenticate buyers using JWT.

- **authenticateSeller**

  - Middleware to authenticate sellers using JWT.

- **checkBookOwnership**
  - Middleware to ensure that the seller can only access or modify their own books.

### Error Handling

Common status codes and error messages:

- **400 Bad Request:** Invalid input or missing fields.
  - Example: `"Email or password is invalid"`
- **401 Unauthorized:** Authentication token is missing or invalid.
  - Example: `"Auth token not found"`
- **404 Not Found:** Resource not found.
  - Example: `"Book not found"`
- **500 Internal Server Error:** Server encountered an error.
  - Example: `"Internal server error"`

## Contact

- Author: Nilavo Bhattacharya
- Email: bhattacharyanilavo2001@gmail.com
