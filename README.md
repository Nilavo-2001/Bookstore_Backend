Here's a comprehensive README for your project:

---

# Bookstore Backend API

## Overview

This project is a RESTful backend API for a bookstore application. It allows sellers to manage their books and users to view books. The application supports user and seller registration, authentication, and authorization using JWT. Sellers can upload books via CSV, view, edit, and delete their books, while users can view details of available books.

## Features

- **User and Seller Registration:** Users and sellers can sign up with a name, email, and password.
- **Login:** Both users and sellers can log in using their email and password.
- **JWT Authentication:** Secure authentication using JSON Web Tokens (JWT).
- **Book Management:** Sellers can upload, view, edit, and delete books.
- **CSV Upload:** Sellers can add multiple books by uploading a CSV file.
- **Authorization:** Sellers can only manage their own books.
- **Book Viewing:** Users can view all books and details of a specific book.

## Technologies Used

- **Node.js**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL/MySQL**
- **Multer**
- **JWT**
- **JavaScript(optional)**

## Prerequisites

- Node.js
- PostgreSQL or MySQL database
- Prisma CLI
- Environment variables configured (.env file)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/bookstore-backend.git
   cd bookstore-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the database:**

   - Ensure PostgreSQL or MySQL is installed and running.
   - Create a new database for the project.
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

- **Register (User/Seller)**

  - `POST /api/register`
  - Request Body: `{ "name": "string", "email": "string", "password": "string", "role": "user|seller" }`

- **Login (User/Seller)**
  - `POST /api/login`
  - Request Body: `{ "email": "string", "password": "string" }`

### Books

- **Upload Books (CSV) (Seller Only)**

  - `POST /api/books/upload`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Form Data: `{ "file": "<CSV file>" }`

- **View All Books**

  - `GET /api/books`

- **View Book Details**

  - `GET /api/books/:id`

- **Update Book (Seller Only)**

  - `PUT /api/books/:id`
  - Headers: `{ "Authorization": "Bearer <token>" }`
  - Request Body: `{ "title": "string", "author": "string", "price": "number" }`

- **Delete Book (Seller Only)**
  - `DELETE /api/books/:id`
  - Headers: `{ "Authorization": "Bearer <token>" }`

## Multer Configuration

The Multer configuration is set up to handle CSV file uploads. It is located in `middlewares/multerConfig.js`.

## Error Handling

### Common Status Codes

- **400 Bad Request:** Invalid input or missing fields.
- **401 Unauthorized:** Authentication token is missing or invalid.
- **403 Forbidden:** User does not have permission to access the resource.
- **404 Not Found:** Resource not found.
- **500 Internal Server Error:** Server encountered an error.

## Example Error Messages

- Missing email or password: `400 Bad Request`
  - Error Message: `"Email or password is required"`
- User already exists: `400 Bad Request`
  - Error Message: `"User already exists"`
- Auth token not found: `401 Unauthorized`
  - Error Message: `"Auth token not found"`
- Book not found: `404 Not Found`
  - Error Message: `"Book not found"`
- Insufficient permissions: `403 Forbidden`
  - Error Message: `"Access forbidden: insufficient permissions"`

## Contributing

Feel free to submit issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## Contact

- Author: Your Name
- Email: your-email@example.com
- GitHub: [your-username](https://github.com/your-username)

---

This README provides a comprehensive overview of your project, covering installation, setup, API endpoints, and error handling. It also includes common status codes and example error messages for clarity.
