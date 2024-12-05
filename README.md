# BlogPost Application

This is a full-stack web application for managing blog posts, built with MongoDB, Express.js, and vanilla JavaScript. The application allows users to create, read, update, and delete blog posts, manage comments, and search posts by tags.

## Features

Our BlogPost application provides a comprehensive set of features for blog management:

- Author management with user profiles
- Blog post creation and management
- Commenting system
- Tag-based search functionality
- Real-time notifications for user actions
- Responsive design for various screen sizes

## Prerequisites

Before setting up the application, ensure you have the following installed on your system:

- Node.js (v14.0.0 or higher)
- MongoDB (v4.0.0 or higher)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Project Structure

The project follows a clear separation between frontend and backend components:

```
Blog-App/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Blog.js
│   │   └── Tag.js
│   ├── server.js
│   └── init-db.js
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── package.json
```

## Installation

Follow these steps to set up the application:

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd Blog-App
   ```

2. Install dependencies:
   ```bash
   npm init -y
   npm install express mongoose cors dotenv
   ```

3. Create a `.env` file in the root directory:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/BlogApp
   ```

## Database Setup

1. Start MongoDB:
   ```bash
   # Windows: MongoDB should be running as a service
   # Mac: brew services start mongodb-community
   # Linux: sudo systemctl start mongod
   ```

2. Initialize the database with sample data:
   ```bash
   node backend/init-db.js
   ```

This will create sample users, blogs, and comments in your database.

## Running the Application

1. Start the backend server:
   ```bash
   node backend/server.js
   ```
   The server will run on http://localhost:3000

2. For the frontend, you have several options:

   Using VS Code's Live Server:
   - Install the "Live Server" extension
   - Right-click on frontend/index.html
   - Select "Open with Live Server"
   
   Using Python's built-in server:
   ```bash
   cd frontend
   python -m http.server 8080
   ```
   
   Using Node's http-server:
   ```bash
   npm install -g http-server
   cd frontend
   http-server
   ```

   The frontend will be available at http://localhost:8080 or http://127.0.0.1:5500 (Live Server)

## API Endpoints

The application provides the following API endpoints:

### Users
- GET `/api/users` - Retrieve all users
- POST `/api/users` - Create a new user

### Blogs
- GET `/api/blogs` - Get all blogs
- GET `/api/blogs?author=:authorId` - Get blogs by author
- POST `/api/blogs` - Create a new blog
- PUT `/api/blogs/:id` - Update a blog
- DELETE `/api/blogs/:id` - Delete a blog

### Comments
- POST `/api/blogs/:id/comments` - Add a comment to a blog

### Tags
- GET `/api/blogs/tags/:tag` - Search blogs by tag

## Usage Guide

1. Select an author from the dropdown menu to view their blogs
2. Create a new blog post using the "New Blog" button
3. Add comments to blogs by clicking "Add Comment"
4. Search for blogs by tags using the tag search feature
5. Edit or delete blogs using the respective buttons

## Error Handling

The application includes comprehensive error handling:
- Database connection errors are logged to the console
- API errors return appropriate HTTP status codes
- Frontend displays user-friendly error notifications

## Troubleshooting

Common issues and solutions:

1. If MongoDB fails to connect:
   - Verify MongoDB is running
   - Check MongoDB connection string
   - Ensure MongoDB port (27017) is not blocked

2. If the server won't start:
   - Check if port 3000 is already in use
   - Verify all dependencies are installed
   - Check for syntax errors in server.js

3. If frontend can't connect to backend:
   - Verify backend server is running
   - Check CORS configuration
   - Confirm API_BASE_URL in script.js

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- MongoDB documentation and community
- Express.js framework
- Contributors and testers

For additional help or questions, please open an issue in the repository.