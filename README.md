# Setlist Builder + Sync

A web application for musicians to create, organize, edit, and share setlists for their performances. This tool streamlines the process of building setlists, tracking song information, and collaborating with band members in real-time.

## Features

- **User Management**: Create accounts, form bands, and manage permissions
- **Song Library**: Store song details including key, tempo, duration, and attachments
- **Setlist Creation**: Build and organize setlists with drag-and-drop functionality
- **Real-time Collaboration**: Synchronous editing and commenting for band members
- **Version Tracking**: Track changes to setlists and revert if needed
- **Export Options**: Export setlists to various formats (PDF, CSV, text)
- **Mobile Responsive**: Use on any device with a touch-friendly interface

## Technology Stack

### Frontend
- React.js with Redux for state management
- Material-UI for UI components
- Socket.io client for real-time communication
- Vite for build tooling

### Backend
- Node.js with Express
- RESTful API with GraphQL support
- Socket.io for real-time functionality
- JWT for authentication
- PostgreSQL database with Sequelize ORM
- Redis for caching

### Deployment
- Docker containerization
- GitHub Actions for CI/CD
- AWS hosting (EC2, S3, RDS)
- Cloudflare CDN

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL
- Redis
- Docker and Docker Compose (optional for containerized development)

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/dxaginfo/setlist-builder-sync-music-app.git
   cd setlist-builder-sync-music-app
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in both the `server` and `client` directories
   - Update the values according to your local environment

4. Set up the database:
   ```bash
   cd ../server
   npm run db:create
   npm run db:migrate
   npm run db:seed # Optional for development data
   ```

5. Start the development servers:
   ```bash
   # Start the backend server
   cd ../server
   npm run dev

   # In a separate terminal, start the frontend
   cd ../client
   npm run dev
   ```

6. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Docker Setup

1. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

2. Access the application:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8081

## Project Structure

```
setlist-builder-sync-music-app/
├── client/                  # Frontend React application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # React components
│   │   ├── contexts/        # Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API and service functions
│   │   ├── store/           # Redux store configuration
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # Entry point
│   ├── .env.example         # Example environment variables
│   └── package.json         # Frontend dependencies
├── server/                  # Backend Node.js application
│   ├── src/                 # Source code
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── .env.example         # Example environment variables
│   └── package.json         # Backend dependencies
├── docker-compose.yml       # Docker Compose configuration
├── .github/                 # GitHub Actions workflows
├── .gitignore               # Git ignore rules
└── README.md                # Project documentation
```

## API Documentation

API documentation is available at `/api/docs` when running the server locally.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with love for musicians and bands
- Inspired by the needs of performing artists