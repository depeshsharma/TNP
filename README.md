# TNP Portal - Training & Placement Website v2

A modern, full-stack web application for Training & Placement management built with React, Node.js, and MongoDB.

## Features

### Core Features
- **Home Page** - Infinite scroll post listing with filtering and search
- **Post Management** - Create, read, update, and delete posts
- **Rich Text Editor** - Create posts with formatted content
- **User Authentication** - Login and registration system
- **Responsive Design** - Modern UI/UX with Tailwind CSS

### Additional Features
- **Search Functionality** - Search posts by title, content, or keywords
- **Category Filtering** - Filter posts by job, internship, training, etc.
- **Featured Posts** - Highlight important posts
- **Post Analytics** - View counts and likes
- **Tag System** - Organize posts with tags
- **Image Support** - Add featured images to posts
- **Responsive Design** - Works on all devices

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- React Quill for rich text editing
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Bcrypt for password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TNP
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/tnp-website
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. You can use:
   - Local MongoDB installation
   - MongoDB Atlas (cloud)
   - Docker: `docker run -d -p 27017:27017 mongo`

## Running the Application

### Development Mode

1. **Start both frontend and backend simultaneously:**
   ```bash
   npm run dev
   ```

2. **Or start them separately:**
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

### Production Mode

1. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Start the backend:**
   ```bash
   cd server
   npm start
   ```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Posts
- `GET /api/posts` - Get all posts (with pagination and filtering)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `GET /api/posts/featured/list` - Get featured posts
- `GET /api/posts/category/:category` - Get posts by category
- `GET /api/posts/search/:query` - Search posts

## Project Structure

```
TNP/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   └── utils/         # Utility functions
│   └── public/
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── index.js          # Server entry point
└── README.md
```

## Features in Detail

### Home Page
- Infinite scroll for seamless browsing
- Search functionality with real-time results
- Category filtering (Jobs, Internships, Training, etc.)
- Featured posts section
- Responsive grid layout

### Post Creation
- Rich text editor with formatting options
- Image upload support
- Tag system for organization
- Category selection
- Preview before publishing

### Post Management
- Edit and delete posts (author/admin only)
- View analytics (views, likes)
- Like functionality
- Responsive design

### User System
- Secure authentication with JWT
- User profiles with department/year info
- Role-based access control
- Password hashing

## Customization

### Styling
The application uses Tailwind CSS with custom color schemes and components. You can modify:
- `client/tailwind.config.js` - Tailwind configuration
- `client/src/index.css` - Global styles and custom CSS
- `client/src/App.css` - Additional component styles

### Database
The MongoDB schema is defined in `server/models/`. You can extend:
- Post model for additional fields
- User model for more profile information
- Add new models for additional features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.
