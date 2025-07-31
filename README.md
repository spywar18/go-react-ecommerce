# E-commerce Shopping Cart Application

A full-stack e-commerce shopping cart application built with a Go (Gin + Gorm) backend and a React frontend.

---

## Features

-   User registration and authentication (JWT-based)
-   Single device login per user
-   Item listing and management
-   Shopping cart functionality
-   Order creation and history
-   RESTful API design

---

## Tech Stack

### Backend
-   **Go** - Programming language
-   **Gin** - Web framework
-   **Gorm** - ORM for database operations
-   **SQLite** - Database
-   **JWT** - Authentication
-   **Ginkgo** - Testing framework

### Frontend
-   **React** - UI framework
-   **Axios** - HTTP client
-   **JavaScript ES6+**

---

## Project Structure

ecommerce-shopping-cart/
├── backend/
│   ├── main.go
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── database/
│   ├── utils/
│   └── tests/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       └── services/
└── postman/
    └── Shopping_Cart_API.postman_collection.json



## Installation & Setup

### Prerequisites
-   Go 1.19+
-   Node.js 16+
-   npm or yarn

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Initialize Go module and tidy dependencies:
    ```bash
    go mod init ecommerce-shopping-cart
    go mod tidy
    ```

3.  Install dependencies:
    ```bash
    go get https://github.com/gin-gonic/gin
    go get https://github.com/golang-jwt/jwt/v4
    go get https://github.com/onsi/ginkgo/v2
    go get https://github.com/onsi/gomega
    go get golang.org/x/crypto
    go get gorm.io/driver/sqlite
    go get gorm.io/gorm
    go get https://github.com/gin-contrib/cors
    ```

4.  Run the server:
    ```bash
    go run main.go
    ```
    The backend server will start on `http://localhost:8080`.

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm start
    ```
    The frontend will start on `http://localhost:3000`.

---

## API Endpoints

### Authentication
-   `POST /users` - Create a new user
-   `POST /users/login` - User login
-   `GET /users` - List all users

### Items
-   `POST /items` - Create an item
-   `GET /items` - List all items

### Cart (Protected)
-   `POST /carts` - Add item to cart
-   `GET /carts` - Get user's cart

### Orders (Protected)
-   `POST /orders` - Create order from cart
-   `GET /orders` - Get user's orders

---

## Testing

### Backend Tests
1.  Install Ginkgo:
    ```bash
    go install [github.com/onsi/ginkgo/v2/ginkgo](https://github.com/onsi/ginkgo/v2/ginkgo)
    ```
2.  Run tests:
    ```bash
    ginkgo run
    ```

### API Testing with Postman
1.  Import the provided Postman collection: `postman/Shopping_Cart_API.postman_collection.json`.
2.  Set environment variables in Postman:
    -   `base_url`: `http://localhost:8080`
    -   `token`: (This will be set automatically from the login request in a production setup, or you can set it manually after logging in).
3.  **Test Flow:**
    1.  **Create User**: `POST /users`
        ```json
        {
          "username": "test124",
          "password": "hello124"
        }
        ```
    2.  **Login**: `POST /users/login`
        ```json
        {
          "username": "test124",
          "password": "hello124"
        }
        ```
        > Copy the `token` from the response for protected endpoints.
    3.  **Get Items**: `GET /items`
    4.  **Add to Cart**: `POST /carts` (with Bearer token)
        ```json
        {
          "item_id": 1
        }
        ```
    5.  **View Cart**: `GET /carts` (with Bearer token)
    6.  **Create Order**: `POST /orders` (with Bearer token)
    7.  **View Orders**: `GET /orders` (with Bearer token)

---

## Key Implementation Notes

-   **Single Device Login**: Each user can only have one active token at a time.
-   **One Cart Per User**: Users maintain a single cart that persists until checkout.
-   **Token-based Auth**: JWT tokens are required for all cart and order operations.
-   **No Inventory Management**: As requested, no stock tracking is implemented.
-   **Automatic Cart Clearing**: Cart items are cleared after a successful order is created.
-   **Database Migration**: The database schema is auto-migrated on server startup.
-   **Seeded Data**: Default items are created for immediate testing.
-   **CORS Enabled**: The backend is configured to accept requests from the frontend origin.

---    