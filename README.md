# E-commerce Shopping Cart

A full-stack e-commerce application built with Go (Gin + Gorm) backend and React frontend.

## Features

- User registration and authentication (JWT-based)
- Single device login per user
- Item listing and management
- Shopping cart functionality
- Order creation and history
- RESTful API design

## Tech Stack

**Backend:** Go, Gin, Gorm, SQLite, JWT
**Frontend:** React, Axios, JavaScript ES6+

## Installation & Setup

### Backend Setup

1. Navigate to the `backend` directory
2. Run `go mod tidy` to install dependencies
3. Start the server: `go run main.go`

The backend server will start on `http://localhost:8081`.

### Frontend Setup

1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

The frontend will start on `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /users` - Create a new user
- `POST /users/login` - User login
- `GET /users` - List all users

### Items
- `POST /items` - Create an item
- `GET /items` - List all items

### Cart (Protected)
- `POST /carts` - Add item to cart
- `GET /carts` - Get user's cart

### Orders (Protected)
- `POST /orders` - Create order from cart
- `GET /orders` - Get user's orders    
