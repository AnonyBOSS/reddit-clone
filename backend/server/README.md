# Reddit Clone Backend API

This document provides a comprehensive overview of the backend API for the Reddit Clone application, including setup instructions, environment variables, full API documentation with sample requests and responses, status codes, and MongoDB schema relationships.

## Table of Contents
1. [Project Setup Instructions](#1-project-setup-instructions)
2. [Environment Variables Documentation](#2-environment-variables-documentation)
3. [API Documentation](#3-api-documentation)
    - [Auth Routes](#auth-routes)
    - [User Routes](#user-routes)
    - [Community Routes](#community-routes)
    - [Posts Routes](#posts-routes)
    - [Comment Routes](#comment-routes)
    - [Votes Routes](#votes-routes)
    - [Comment Votes Routes](#comment-votes-routes)
    - [Upload Routes](#upload-routes)
4. [Status Codes and Error Handling](#4-status-codes-and-error-handling)
5. [MongoDB ERD / Relationships Description](#5-mongodb-erd--relationships-description)

---

## 1. Project Setup Instructions

To get the backend server up and running, follow these steps:

1.  **Navigate to the backend directory:**
    ```bash
    cd backend/server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Copy the `.env.example` (if present, otherwise create one) and populate it with your environment variables (see [Environment Variables Documentation](#2-environment-variables-documentation)).

4.  **Start the server:**
    ```bash
    npm start
    ```
    The server will typically run on `http://localhost:5000` (or the port specified in your `.env` file).

---

## 2. Environment Variables Documentation

Create a `.env` file in the `backend/server/` directory with the following variables:

-   **`PORT`**: The port number the server will listen on.
    -   Example: `PORT=5000`
-   **`MONGO_URI`**: The connection string for your MongoDB database.
    -   Example: `MONGO_URI=mongodb://localhost:27017/redditclone`
-   **`JWT_SECRET`**: A secret key used for signing JWT tokens. **Keep this secure and don't share it.**
    -   Example: `JWT_SECRET=your_jwt_secret_key`
-   **`CLOUDINARY_CLOUD_NAME`**: Your Cloudinary cloud name for image uploads.
    -   Example: `CLOUDINARY_CLOUD_NAME=your_cloud_name`
-   **`CLOUDINARY_API_KEY`**: Your Cloudinary API key.
    -   Example: `CLOUDINARY_API_KEY=your_api_key`
-   **`CLOUDINARY_API_SECRET`**: Your Cloudinary API secret. **Keep this secure.**
    -   Example: `CLOUDINARY_API_SECRET=your_api_secret`

---

## 3. API Documentation

All API endpoints return a JSON object with the format:
````json
// Success
{
  "success": true,
  "data": { ... },
  "error": null
}

// Failure
{
  "success": false,
  "data": null,
  "error": "Error message"
}
````

**Authentication:** Routes marked with `(Auth Required)` require a valid JWT token in the `Authorization` header: `Bearer <token>`.

### Auth Routes

*   **`POST /api/auth/signup`**
    *   **Description:** Registers a new user.
    *   **Rate Limited:** Yes
    *   **Request Body:**
        ````json
        {
          "username": "testuser",
          "email": "test@example.com",
          "password": "password123"
        }
        ````
    *   **Sample Success Response (201 Created):**
        ````json
        {
          "success": true,
          "data": {
            "token": "eyJhbGciOiJIUzI1Ni...",
            "user": {
              "id": "60d0fe4f5e2a3c001f1e7e4a",
              "username": "testuser",
              "email": "test@example.com"
            }
          },
          "error": null
        }
        ````
    *   **Sample Error Response (400 Bad Request):**
        ````json
        {
          "success": false,
          "data": null,
          "error": "User already exists"
        }
        ````

*   **`POST /api/auth/login`**
    *   **Description:** Authenticates a user and returns a JWT token.
    *   **Rate Limited:** Yes
    *   **Request Body:**
        ````json
        {
          "emailOrUsername": "testuser",
          "password": "password123"
        }
        ````
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": {
            "token": "eyJhbGciOiJIUzI1Ni...",
            "user": {
              "id": "60d0fe4f5e2a3c001f1e7e4a",
              "username": "testuser",
              "email": "test@example.com"
            }
          },
          "error": null
        }
        ````
    *   **Sample Error Response (400 Bad Request):**
        ````json
        {
          "success": false,
          "data": null,
          "error": "Invalid credentials"
        }
        ````

### User Routes

*   **`GET /api/users/me`** `(Auth Required)`
    *   **Description:** Retrieves the authenticated user's profile information.
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": {
            "_id": "60d0fe4f5e2a3c001f1e7e4a",
            "username": "testuser",
            "email": "test@example.com",
            "bio": "A passionate Redditor.",
            "avatar": "https://res.cloudinary.com/...",
            "displayName": "Testy McTestface",
            "createdAt": "2023-10-26T10:00:00.000Z"
          },
          "error": null
        }
        ````

*   **`PATCH /api/users/me`** `(Auth Required)`
    *   **Description:** Updates the authenticated user's profile.
    *   **Rate Limited:** Yes
    *   **Request Body (Partial):**
        ````json
        {
          "bio": "Updated bio text.",
          "displayName": "New Display Name"
        }
        ````
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": {
            "_id": "60d0fe4f5e2a3c001f1e7e4a",
            "username": "testuser",
            "email": "test@example.com",
            "bio": "Updated bio text.",
            "avatar": "https://res.cloudinary.com/...",
            "displayName": "New Display Name",
            "createdAt": "2023-10-26T10:00:00.000Z"
          },
          "error": null
        }
        ````

*   **`GET /api/users/me/communities`** `(Auth Required)`
    *   **Description:** Retrieves a list of communities the authenticated user is a member of.
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": [
            {
              "_id": "60d0fe4f5e2a3c001f1e7e4b",
              "name": "programming",
              "title": "Programming",
              "description": "A community for programmers.",
              "membersCount": 15000,
              "createdAt": "2023-10-20T12:00:00.000Z"
            },
            {
              "_id": "60d0fe4f5e2a3c001f1e7e4c",
              "name": "webdev",
              "title": "Web Development",
              "description": "Discussions on web development.",
              "membersCount": 20000,
              "createdAt": "2023-10-22T14:30:00.000Z"
            }
          ],
          "error": null
        }
        ````

*   **`GET /api/users/me/saved`** `(Auth Required)`
    *   **Description:** Retrieves a list of posts saved by the authenticated user.
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": [
            {
              "_id": "60d0fe4f5e2a3c001f1e7e4d",
              "title": "My first saved post",
              "body": "Content of the saved post.",
              "author": {
                "_id": "60d0fe4f5e2a3c001f1e7e4e",
                "username": "postauthor"
              },
              "community": {
                "_id": "60d0fe4f5e2a3c001f1e7e4f",
                "name": "tech",
                "title": "Technology"
              },
              "score": 120,
              "commentsCount": 15,
              "createdAt": "2023-11-01T08:00:00.000Z"
            }
          ],
          "error": null
        }
        ````

*   **`GET /api/users/:username`**
    *   **Description:** Retrieves a public profile for a specific user, including their posts, comment count, and communities joined.
    *   **Parameters:**
        *   `username` (path): The username of the target user.
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": {
            "_id": "60d0fe4f5e2a3c001f1e7e4a",
            "username": "profileuser",
            "displayName": "Profile User",
            "bio": "Just another user.",
            "avatar": "https://res.cloudinary.com/...",
            "createdAt": "2023-09-15T11:00:00.000Z",
            "posts": [
              {
                "_id": "60d0fe4f5e2a3c001f1e7e50",
                "title": "A post by profileuser",
                "body": "Post content...",
                "author": {
                  "_id": "60d0fe4f5e2a3c001f1e7e4a",
                  "username": "profileuser"
                },
                "community": {
                  "_id": "60d0fe4f5e2a3c001f1e7e4f",
                  "name": "general",
                  "title": "General Discussions"
                },
                "score": 50,
                "commentsCount": 5,
                "createdAt": "2023-11-10T10:00:00.000Z"
              }
            ],
            "commentCount": 25,
            "communitiesJoined": [
              {
                "_id": "60d0fe4f5e2a3c001f1e7e4b",
                "name": "askreddit",
                "title": "Ask Reddit"
              }
            ]
          },
          "error": null
        }
        ````

### Community Routes

*   **`POST /api/communities`** `(Auth Required)`
    *   **Description:** Creates a new community. The creator is automatically added as a moderator.
    *   **Rate Limited:** Yes
    *   **Request Body:**
        ````json
        {
          "name": "mycommunity",
          "title": "My Awesome Community",
          "description": "A place for awesome things."
        }
        ````
    *   **Sample Success Response (201 Created):**
        ````json
        {
          "success": true,
          "data": {
            "_id": "60d0fe4f5e2a3c001f1e7e51",
            "name": "mycommunity",
            "title": "My Awesome Community",
            "description": "A place for awesome things.",
            "createdBy": "60d0fe4f5e2a3c001f1e7e4a",
            "membersCount": 1,
            "createdAt": "2023-11-20T09:00:00.000Z"
          },
          "error": null
        }
        ````

*   **`GET /api/communities/:name`**
    *   **Description:** Retrieves details for a specific community.
    *   **Parameters:**
        *   `name` (path): The unique name of the community.
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": {
            "_id": "60d0fe4f5e2a3c001f1e7e51",
            "name": "mycommunity",
            "title": "My Awesome Community",
            "description": "A place for awesome things.",
            "createdBy": "60d0fe4f5e2a3c001f1e7e4a",
            "membersCount": 150,
            "createdAt": "2023-11-20T09:00:00.000Z"
          },
          "error": null
        }
        ````

*   **`GET /api/communities`**
    *   **Description:** Retrieves a list of communities, sorted by `membersCount`.
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": [
            {
              "_id": "60d0fe4f5e2a3c001f1e7e4b",
              "name": "programming",
              "title": "Programming",
              "description": "A community for programmers.",
              "membersCount": 15000
            },
            {
              "_id": "60d0fe4f5e2a3c001f1e7e4c",
              "name": "webdev",
              "title": "Web Development",
              "description": "Discussions on web development.",
              "membersCount": 20000
            }
          ],
          "error": null
        }
        ````

*   **`POST /api/communities/:name/join`** `(Auth Required)`
    *   **Description:** Allows the authenticated user to join a community.
    *   **Rate Limited:** Yes
    *   **Parameters:**
        *   `name` (path): The unique name of the community.
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "joined": true,
          "membersCount": 151,
          "error": null
        }
        ````
    *   **Sample Error Response (404 Not Found):**
        ````json
        {
          "success": false,
          "data": null,
          "error": "Community not found"
        }
        ````

*   **`POST /api/communities/:name/leave`** `(Auth Required)`
    *   **Description:** Allows the authenticated user to leave a community.
    *   **Rate Limited:** Yes
    *   **Parameters:**
        *   `name` (path): The unique name of the community.
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "joined": false,
          "membersCount": 150,
          "error": null
        }
        ````
    *   **Sample Error Response (404 Not Found):**
        ````json
        {
          "success": false,
          "data": null,
          "error": "Community not found"
        }
        ````

### Posts Routes

*   **`POST /api/posts`** `(Auth Required)`
    *   **Description:** Creates a new post.
    *   **Rate Limited:** Yes
    *   **Request Body:**
        ````json
        {
          "title": "My first post",
          "body": "This is the content of my first post.",
          "communityName": "mycommunity",
          "url": "http://example.com/link"
        }
        ````
    *   **Sample Success Response (201 Created):**
        ````json
        {
          "success": true,
          "data": {
            "_id": "60d0fe4f5e2a3c001f1e7e52",
            "title": "My first post",
            "body": "This is the content of my first post.",
            "author": { "_id": "60d0fe4f5e2a3c001f1e7e4a", "username": "testuser" },
            "community": { "_id": "60d0fe4f5e2a3c001f1e7e51", "name": "mycommunity", "title": "My Awesome Community" },
            "url": "http://example.com/link",
            "score": 0,
            "commentsCount": 0,
            "createdAt": "2023-11-25T14:00:00.000Z"
          },
          "error": null
        }
        ````

*   **`GET /api/posts`**
    *   **Description:** Retrieves a list of posts with optional filtering and sorting.
    *   **Query Parameters:**
        *   `page` (optional): Current page number (default: 1).
        *   `limit` (optional): Number of posts per page (default: 10).
        *   `community` (optional): Filter posts by community name.
        *   `sort` (optional): Sorting criteria (`new`, `top`, `hot`).
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": {
            "posts": [
              {
                "_id": "60d0fe4f5e2a3c001f1e7e52",
                "title": "My first post",
                "author": { "_id": "60d0fe4f5e2a3c001f1e7e4a", "username": "testuser" },
                "community": { "_id": "60d0fe4f5e2a3c001f1e7e51", "name": "mycommunity", "title": "My Awesome Community" },
                "score": 10,
                "commentsCount": 2,
                "createdAt": "2023-11-25T14:00:00.000Z"
              }
            ],
            "page": 1,
            "totalPages": 5
          },
          "error": null
        }
        ````

*   **`GET /api/posts/:id`**
    *   **Description:** Retrieves a single post by its ID.
    *   **Parameters:**
        *   `id` (path): The ObjectId of the post.
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": {
            "_id": "60d0fe4f5e2a3c001f1e7e52",
            "title": "My first post",
            "body": "This is the content of my first post.",
            "author": { "_id": "60d0fe4f5e2a3c001f1e7e4a", "username": "testuser" },
            "community": { "_id": "60d0fe4f5e2a3c001f1e7e51", "name": "mycommunity", "title": "My Awesome Community" },
            "url": "http://example.com/link",
            "score": 10,
            "commentsCount": 2,
            "createdAt": "2023-11-25T14:00:00.000Z"
          },
          "error": null
        }
        ````
    *   **Sample Error Response (404 Not Found):**
        ````json
        {
          "success": false,
          "data": null,
          "error": "Post not found"
        }
        ````

*   **`DELETE /api/posts/:id`** `(Auth Required)`
    *   **Description:** Deletes a post by its ID. Only the author can delete their post. This operation cascades to delete related votes, saved posts, and comments.
    *   **Parameters:**
        *   `id` (path): The ObjectId of the post.
    *   **Rate Limited:** Yes
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": null,
          "error": null
        }
        ````
    *   **Sample Error Response (403 Forbidden):**
        ````json
        {
          "success": false,
          "data": null,
          "error": "Unauthorized: You are not the author of this post"
        }
        ````

*   **`POST /api/posts/:id/save`** `(Auth Required)`
    *   **Description:** Saves a post for the authenticated user.
    *   **Parameters:**
        *   `id` (path): The ObjectId of the post to save.
    *   **Rate Limited:** Yes
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "saved": true,
          "error": null
        }
        ````
    *   **Sample Error Response (404 Not Found):**
        ````json
        {
          "success": false,
          "data": null,
          "error": "Post not found"
        }
        ````

*   **`DELETE /api/posts/:id/save`** `(Auth Required)`
    *   **Description:** Un-saves a post for the authenticated user.
    *   **Parameters:**
        *   `id` (path): The ObjectId of the post to un-save.
    *   **Rate Limited:** Yes
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "saved": false,
          "error": null
        }
        ````
    *   **Sample Error Response (404 Not Found):**
        ````json
        {
          "success": false,
          "data": null,
          "error": "Post not found"
        }
        ````

### Comment Routes

*   **`POST /api/comments`** `(Auth Required)`
    *   **Description:** Creates a new comment on a post or as a reply to another comment.
    *   **Rate Limited:** Yes
    *   **Request Body:**
        ````json
        {
          "postId": "60d0fe4f5e2a3c001f1e7e52",
          "body": "This is a new comment.",
          "parent": null // Optional: if replying to another comment
        }
        ````
    *   **Sample Success Response (201 Created):**
        ````json
        {
          "success": true,
          "data": {
            "_id": "60d0fe4f5e2a3c001f1e7e53",
            "post": "60d0fe4f5e2a3c001f1e7e52",
            "author": { "_id": "60d0fe4f5e2a3c001f1e7e4a", "username": "testuser" },
            "body": "This is a new comment.",
            "score": 0,
            "createdAt": "2023-11-26T10:00:00.000Z"
          },
          "error": null
        }
        ````

*   **`GET /api/comments/post/:postId`**
    *   **Description:** Retrieves comments for a specific post, organized in a nested tree structure.
    *   **Parameters:**
        *   `postId` (path): The ObjectId of the post.
    *   **Query Parameters:**
        *   `page` (optional): Current page number (default: 1).
        *   `limit` (optional): Number of comments per page (default: 50, max 200).
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": {
            "comments": [
              {
                "_id": "60d0fe4f5e2a3c001f1e7e53",
                "post": "60d0fe4f5e2a3c001f1e7e52",
                "author": { "_id": "60d0fe4f5e2a3c001f1e7e4a", "username": "testuser" },
                "body": "This is a new comment.",
                "score": 5,
                "createdAt": "2023-11-26T10:00:00.000Z",
                "replies": [
                  {
                    "_id": "60d0fe4f5e2a3c001f1e7e54",
                    "post": "60d0fe4f5e2a3c001f1e7e52",
                    "author": { "_id": "60d0fe4f5e2a3c001f1e7e4b", "username": "anotheruser" },
                    "body": "A reply to the comment.",
                    "parent": "60d0fe4f5e2a3c001f1e7e53",
                    "score": 2,
                    "createdAt": "2023-11-26T10:10:00.000Z",
                    "replies": []
                  }
                ]
              }
            ],
            "page": 1,
            "totalPages": 1
          },
          "error": null
        }
        ````
    *   **Sample Error Response (400 Bad Request):**
        ````json
        {
          "success": false,
          "data": null,
          "error": "Invalid Post ID"
        }
        ````

*   **`DELETE /api/comments/:id`** `(Auth Required)`
    *   **Description:** Deletes a comment by its ID. Only the author can delete their comment. This operation cascades to delete related comment votes.
    *   **Parameters:**
        *   `id` (path): The ObjectId of the comment.
    *   **Rate Limited:** Yes
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": null,
          "error": null
        }
        ````
    *   **Sample Error Response (403 Forbidden):**
        ````json
        {
          "success": false,
          "data": null,
          "error": "Unauthorized: You are not the author of this comment"
        }
        ````

### Votes Routes

*   **`POST /api/posts/:id/vote`** `(Auth Required)`
    *   **Description:** Casts or changes a vote on a post.
    *   **Parameters:**
        *   `id` (path): The ObjectId of the post.
    *   **Rate Limited:** Yes
    *   **Request Body:**
        ````json
        {
          "direction": 1 // 1 for upvote, -1 for downvote
        }
        ````
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": {
            "post": {
              "_id": "60d0fe4f5e2a3c001f1e7e52",
              "title": "My first post",
              "score": 11,
              // ... other post fields
            },
            "yourVote": 1
          },
          "error": null
        }
        ````
    *   **Sample Error Response (400 Bad Request):**
        ````json
        {
          "success": false,
          "data": null,
          "error": "Invalid direction"
        }
        ````

*   **`DELETE /api/posts/:id/vote`** `(Auth Required)`
    *   **Description:** Removes any existing vote by the authenticated user on a post.
    *   **Parameters:**
        *   `id` (path): The ObjectId of the post.
    *   **Rate Limited:** Yes
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": {
            "post": {
              "_id": "60d0fe4f5e2a3c001f1e7e52",
              "title": "My first post",
              "score": 10,
              // ... other post fields
            },
            "yourVote": 0
          },
          "error": null
        }
        ````

### Comment Votes Routes

*   **`POST /api/comments/:id/vote`** `(Auth Required)`
    *   **Description:** Casts or changes a vote on a comment.
    *   **Parameters:**
        *   `id` (path): The ObjectId of the comment.
    *   **Rate Limited:** Yes
    *   **Request Body:**
        ````json
        {
          "value": -1 // 1 for upvote, -1 for downvote
        }
        ````
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": {
            "score": -1,
            "yourVote": -1
          },
          "error": null
        }
        ````
    *   **Sample Error Response (400 Bad Request):**
        ````json
        {
          "success": false,
          "data": null,
          "error": "Invalid vote value"
        }
        ````

*   **`DELETE /api/comments/:id/vote`** `(Auth Required)`
    *   **Description:** Removes any existing vote by the authenticated user on a comment.
    *   **Parameters:**
        *   `id` (path): The ObjectId of the comment.
    *   **Rate Limited:** Yes
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": {
            "score": 0,
            "yourVote": 0
          },
          "error": null
        }
        ````

### Upload Routes

*   **`POST /api/users/upload-avatar`** `(Auth Required)`
    *   **Description:** Uploads an avatar image for the authenticated user.
    *   **Rate Limited:** Yes
    *   **Request Body:** `multipart/form-data` with a field named `image` containing the image file.
    *   **Sample Success Response (200 OK):**
        ````json
        {
          "success": true,
          "data": {
            "id": "60d0fe4f5e2a3c001f1e7e4a",
            "username": "testuser",
            "email": "test@example.com",
            "avatar": "https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/avatar_public_id.jpg"
          },
          "error": null
        }
        ````
    *   **Sample Error Response (400 Bad Request):**
        ````json
        {
          "success": false,
          "data": null,
          "error": "File too large (max 5MB)"
        }
        ````

---

## 4. Status Codes and Error Handling

All API errors are returned in the standard JSON format:
````json
{
  "success": false,
  "data": null,
  "error": "Descriptive error message"
}
````

| Status Code | Description                                  | Common Error Messages                   |
| :---------- | :------------------------------------------- | :-------------------------------------- |
| `200 OK`    | Request successful.                          | -                                       |
| `201 Created` | Resource created successfully.               | -                                       |
| `400 Bad Request` | Invalid input or request data.               | `Missing fields`, `User already exists`, `Invalid credentials`, `Invalid ID`, `Invalid file type`, `File too large` |
| `401 Unauthorized` | Authentication required or invalid token.    | `Not authorized, token failed`          |
| `403 Forbidden` | User does not have permission to access.     | `Unauthorized: You are not the author of this post/comment` |
| `404 Not Found` | Resource not found.                          | `User not found`, `Community not found`, `Post not found`, `Comment not found` |
| `429 Too Many Requests` | Rate limit exceeded.                       | `Too many requests, please try again later.` |
| `500 Internal Server Error` | Unexpected server-side error.        | Generic error message from `err.message`|

---

## 5. MongoDB ERD / Relationships Description

Here's a description of the key MongoDB collections and their relationships:

**Collections:**

*   **`User`**: Stores user account information.
    *   `username`: Unique, indexed.
    *   `email`: Unique, indexed.
    *   `passwordHash`: Stored securely.
    *   `bio`, `avatar`, `displayName`, `createdAt`.
*   **`Community`**: Represents a subreddit-like community.
    *   `name`: Unique, indexed.
    *   `title`, `description`.
    *   `createdBy`: `ObjectId` referencing `User`.
    *   `membersCount`: Number of members (kept in sync with `CommunityMember` documents).
    *   `createdAt`.
*   **`CommunityMember`**: Links `User`s to `Community`s and defines their role within that community.
    *   `user`: `ObjectId` referencing `User`, indexed.
    *   `community`: `ObjectId` referencing `Community`, indexed.
    *   `role`: (`"member"`, `"moderator"`).
    *   Unique index on `{user, community}`.
*   **`Post`**: Represents a post made by a user in a community.
    *   `title`, `body`, `url`, `imageUrl`.
    *   `author`: `ObjectId` referencing `User`, indexed.
    *   `community`: `ObjectId` referencing `Community`, indexed.
    *   `score`: Total votes, indexed.
    *   `commentsCount`: Total comments on the post.
    *   `createdAt`, `updatedAt`.
*   **`Comment`**: Represents a comment on a post or a reply to another comment.
    *   `post`: `ObjectId` referencing `Post`, indexed.
    *   `author`: `ObjectId` referencing `User`.
    *   `body`.
    *   `parent`: Optional `ObjectId` referencing another `Comment` for nested replies.
    *   `score`: Total votes on the comment.
    *   `createdAt`.
*   **`Vote`**: Records a user's vote on a post.
    *   `user`: `ObjectId` referencing `User`, indexed.
    *   `post`: `ObjectId` referencing `Post`, indexed.
    *   `value`: (`1` for upvote, `-1` for downvote).
    *   Unique index on `{user, post}`.
*   **`CommentVote`**: Records a user's vote on a comment.
    *   `user`: `ObjectId` referencing `User`, indexed.
    *   `comment`: `ObjectId` referencing `Comment`, indexed.
    *   `value`: (`1` for upvote, `-1` for downvote).
    *   Unique index on `{user, comment}`.
*   **`SavedPost`**: Records which posts a user has saved.
    *   `user`: `ObjectId` referencing `User`, indexed.
    *   `post`: `ObjectId` referencing `Post`, indexed.
    *   Unique index on `{user, post}`.

**Relationships:**

*   `User` 1 -- M `Post` (User creates many posts)
*   `User` 1 -- M `Comment` (User creates many comments)
*   `User` 1 -- M `Vote` (User casts many votes on posts)
*   `User` 1 -- M `CommentVote` (User casts many votes on comments)
*   `User` 1 -- M `CommunityMember` (User can be a member of many communities)
*   `User` 1 -- M `SavedPost` (User saves many posts)

*   `Community` 1 -- M `Post` (Community has many posts)
*   `Community` 1 -- M `CommunityMember` (Community has many members)

*   `Post` 1 -- M `Comment` (Post has many comments)
*   `Post` 1 -- M `Vote` (Post receives many votes)
*   `Post` 1 -- M `SavedPost` (Post can be saved by many users)

*   `Comment` 1 -- M `CommentVote` (Comment receives many votes)
*   `Comment` 1 -- M `Comment` (Comments can have many child comments/replies)

---
