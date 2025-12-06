# Reddit Clone Backend API

This document provides an overview of the Reddit Clone backend API, including setup instructions, environment variables, and a comprehensive list of all available API endpoints with example requests and responses.

## Project Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/reddit-clone.git
    cd reddit-clone/backend/server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Refer to the ".env variables needed" section below for required environment variables.

4.  **Run the development server:**
    ```bash
    npm start
    ```
    The server will typically run on `http://localhost:5000`.

## .env variables needed

Create a file named `.env` in the `backend/server/` directory with the following variables:

-   `MONGO_URI`: Your MongoDB connection URI. Example: `mongodb://127.0.0.1:27017/reddit_clone`
-   `JWT_SECRET`: A secret key for signing JWT tokens. Example: `supersecretjwtkey`
-   `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name for image uploads.
-   `CLOUDINARY_API_KEY`: Your Cloudinary API key.
-   `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.

## API Endpoints

All endpoints are prefixed with `/api`.

---

### 1. Authentication

-   **`POST /api/auth/signup`**
    -   **Description:** Registers a new user.
    -   **Request Body:**
        ```json
        {
          "username": "testuser",
          "email": "test@example.com",
          "password": "password123"
        }
        ```
    -   **Example Success Response (201 Created):**
        ```json
        {
          "success": true,
          "data": {
            "token": "eyJhbGciOiJIUzI1Ni...",
            "user": {
              "id": "60d0fe4f5b5e7f001c8e1a1b",
              "username": "testuser",
              "email": "test@example.com"
            }
          },
          "error": null
        }
        ```
    -   **Example Error Response (400 Bad Request):**
        ```json
        {
          "success": false,
          