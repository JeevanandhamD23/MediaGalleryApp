# Media Gallery App

A full-stack media management application built with React and Node.js that allows users to
upload, organize, and manage their photos and videos efficiently.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Project Structure

## 🚀 Features

- **Media Management**

  - Upload and store photos and videos
  - Organize media into collections
  - Star favorite items
  - Move items to trash with recovery option
  - Search media by description
  - Filter by media type (photos/videos)

- **Smart Organization**

  - View all media in one place
  - Separate sections for photos and videos
  - Recently added section
  - Favorites collection
  - Trash management

- **Real-time Search**

  - Debounced search functionality
  - Filter by description
  - Dynamic search across all media types

- **Storage Management**
  - Monitor storage usage
  - View storage statistics
  - Track file sizes and counts

## 🛠️ Technical Stack

### Frontend

- React.js
- Ant Design UI Framework
- Axios for API calls
- Lodash for utility functions
- Responsive design

### Backend

- Node.js & Express
- MongoDB & Mongoose
- Multer for file uploads
- CORS enabled
- Health check endpoints

### DevOps

- Docker containerization
- Docker Compose for orchestration
- Nginx for serving static files
- Volume management for persistence

## 🏗️ Architecture

- RESTful API design
- MVC pattern
- Containerized microservices
- Scalable file storage system

## 🚦 Getting Started

1. Clone the repository

2. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Create environment files:

Create `.env` in the root directory for frontend:

```env
REACT_APP_API_URL=http://localhost:5000
```

Create `.env` in the server directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pandophotos
```

## 🏃‍♂️ Running the Application

### Development Mode

1. Start the backend server:

```bash
# From the server directory
npm start
```

2. Start the frontend development server (in a new terminal):

```bash
# From the root directory
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🧪 Testing

### Backend Tests

```bash
# Run backend tests
npm run test:server

# Run backend tests with watch mode
npm run test:server:watch

# Run backend tests with coverage
npm run test:server:coverage
```

Test files are organized in the following structure:

```
server/test/
├── lib/                # Service tests
├── controller/         # Controller tests
├── db/                 # Repository tests
├── presentator/        # Model tests
├── middleware/         # Middleware tests
└── config/            # Test configuration
```

### Frontend Tests

```bash
# Run frontend unit tests
npm run test:client

# Run frontend unit tests with watch mode
npm run test:client --watch
```

### End-to-End Tests

```bash
# Open Cypress Test Runner
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run

# Run E2E tests with server
npm run test:e2e
```

Cypress tests are organized in:

```
cypress/
├── e2e/              # Test specs
├── fixtures/         # Test data
└── support/          # Custom commands
```

## 📊 Test Coverage

To generate test coverage reports:

```bash
# Backend coverage
npm run test:server:coverage

# Frontend coverage
npm run test:client --coverage
```

Coverage reports will be generated in:

- Backend: `server/coverage/`
- Frontend: `coverage/`

## 🔌 API Documentation

### Images

- `GET /api/images` - Get all images
- `POST /api/images` - Upload a new image
- `DELETE /api/images/:id` - Move image to trash

### Videos

- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload a new video
- `DELETE /api/videos/:id` - Move video to trash

### Trash

- `GET /api/trash` - Get all trash items
- `PATCH /api/trash/:id/restore` - Restore item from trash
- `DELETE /api/trash/:id` - Permanently delete item

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Scripts Reference

### Root Package Scripts

```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test:server": "cd server && npm test",
  "test:server:watch": "cd server && npm run test:watch",
  "test:server:coverage": "cd server && npm run test:coverage",
  "test:client": "react-scripts test",
  "test:cypress": "cypress run",
  "cypress:open": "cypress open",
  "cypress:run": "cypress run",
  "test:e2e": "start-server-and-test start http://localhost:3000 cypress:run"
}
```

### Server Package Scripts

```json
{
  "start": "node app.js",
  "test": "NODE_ENV=test mocha",
  "test:watch": "NODE_ENV=test mocha --watch",
  "test:coverage": "NODE_ENV=test nyc mocha"
}
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
