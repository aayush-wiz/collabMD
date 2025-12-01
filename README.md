# CollabMD 📝

A modern, feature-rich collaborative Markdown editor built with Next.js and Express. Create, edit, and share beautiful Markdown documents with real-time preview, auto-save, and PDF export capabilities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)

## ✨ Features

### 📄 Document Management
- **Create & Edit** - Intuitive Markdown editor with live preview
- **Auto-Save** - Automatic document saving with visual feedback
- **Document Workspace** - Manage all your documents in one place
- **Public/Private Sharing** - Control document visibility

### ✏️ Rich Text Editing
- **Live Preview** - See your formatted document as you type
- **Multiple View Modes** - Split view, editor-only, or preview-only
- **Formatting Toolbar** - Quick access to common Markdown formatting:
  - Text styling (bold, italic, strikethrough)
  - Headers (H1-H6)
  - Lists (bullet, numbered, checkboxes)
  - Code blocks (inline and fenced)
  - Tables, links, and images
  - Colored highlights and quotes
  - Subscript and dividers
- **Undo/Redo** - Full history support
- **Keyboard Shortcuts** - Efficient editing workflow

### 🎨 User Experience
- **Theme Support** - Light and dark mode
- **Responsive Design** - Works seamlessly on all devices
- **PDF Export** - Download documents as PDF
- **CodeMirror Integration** - Powerful code editing experience
- **GitHub Flavored Markdown** - Full GFM support including tables, task lists, and more

### 🔐 Authentication & Security
- **User Authentication** - Secure signup/signin with JWT
- **Password Hashing** - Bcrypt encryption for passwords
- **Protected Routes** - Middleware-based authentication
- **Token-based Sessions** - Stateless authentication

## 🏗️ Architecture

CollabMD is built as a **Turborepo monorepo** with the following structure:

```
collabMD/
├── apps/
│   ├── backend/          # Express.js API server
│   └── frontend/         # Next.js web application
├── packages/
│   ├── ui/               # Shared React components
│   ├── eslint-config/    # Shared ESLint configurations
│   └── typescript-config/# Shared TypeScript configurations
```

### Tech Stack

#### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Editor**: CodeMirror 6
- **Markdown**: react-markdown, remark-gfm
- **PDF Generation**: pdfmake
- **State Management**: React Context API

#### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt

#### Development Tools
- **Monorepo**: Turborepo
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Node Version**: >=18

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 11.1.0
- **PostgreSQL** >= 13

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/collabMD.git
cd collabMD
```

### 2. Install Dependencies

```bash
npm install
```

This will install dependencies for all workspaces (frontend, backend, and shared packages).

### 3. Database Setup

#### Create PostgreSQL Database

```bash
# Using psql
createdb collabmd

# Or using PostgreSQL CLI
psql -U postgres
CREATE DATABASE collabmd;
```

#### Configure Environment Variables

Create a `.env` file in the `apps/backend` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/collabmd"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Port (optional, defaults to 3001)
PORT=3001
```

Create a `.env.local` file in the `apps/frontend` directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Run Database Migrations

```bash
cd apps/backend
npx prisma migrate dev
npx prisma generate
cd ../..
```

### 4. Start Development Servers

#### Option 1: Start All Services

```bash
npm run dev
```

This starts both frontend and backend concurrently.

#### Option 2: Start Services Individually

**Backend:**
```bash
npm run dev:backend
# Server runs on http://localhost:3001
```

**Frontend:**
```bash
npm run dev:frontend
# App runs on http://localhost:3000
```

### 5. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📁 Project Structure

### Backend (`apps/backend/`)

```
backend/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration history
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts    # Authentication routes
│   │   └── auth.middleware.ts    # JWT middleware
│   ├── documents/
│   │   └── document.controller.ts # Document CRUD operations
│   ├── prisma/
│   │   └── client.ts             # Prisma client instance
│   └── index.ts                  # Express app entry point
├── package.json
└── tsconfig.json
```

### Frontend (`apps/frontend/`)

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── signin/          # Sign-in page
│   │   └── signup/          # Sign-up page
│   ├── editor/
│   │   ├── [id]/            # Edit existing document
│   │   ├── new/             # Create new document
│   │   └── layout.tsx       # Editor layout wrapper
│   ├── workspace/           # Document management
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page (redirects to workspace)
├── components/
│   ├── editor/              # Editor components
│   │   ├── editor-context.tsx      # Editor state management
│   │   ├── editor-navbar.tsx       # Navigation bar
│   │   ├── editor-toolbar.tsx      # Formatting toolbar
│   │   ├── editor-pane.tsx         # CodeMirror editor
│   │   ├── preview-pane.tsx        # Markdown preview
│   │   ├── download-modal.tsx      # PDF export modal
│   │   └── workspace.tsx           # Document workspace
│   ├── ui/                  # Reusable UI components
│   └── workspace/           # Workspace components
├── lib/
│   ├── api-client.ts        # API client utilities
│   ├── local-docs.ts        # Local storage utilities
│   └── utils.ts             # Helper functions
├── providers/
│   ├── auth-provider.tsx    # Authentication context
│   └── theme-provider.tsx   # Theme management
├── public/                  # Static assets
└── types/                   # TypeScript definitions
```

## 🔌 API Documentation

### Base URL
```
http://localhost:3001
```

### Authentication Endpoints

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}

Response: {
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Sign In
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: {
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Document Endpoints

All document endpoints require authentication via Bearer token.

#### List Documents
```http
GET /documents
Authorization: Bearer {token}

Response: [
  {
    "id": "uuid",
    "title": "Document Title",
    "content": "# Markdown content",
    "userId": "uuid",
    "isPublic": false,
    "createdAt": "2025-12-01T00:00:00.000Z",
    "updatedAt": "2025-12-01T00:00:00.000Z",
    "owner": {
      "id": "uuid",
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
]
```

#### Get Document
```http
GET /documents/:id
Authorization: Bearer {token}

Response: {
  "id": "uuid",
  "title": "Document Title",
  "content": "# Markdown content",
  "userId": "uuid",
  "isPublic": false,
  "createdAt": "2025-12-01T00:00:00.000Z",
  "updatedAt": "2025-12-01T00:00:00.000Z",
  "owner": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

#### Create Document
```http
POST /documents
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Document",
  "content": "# Hello World",
  "isPublic": false
}

Response: {
  "id": "uuid",
  "title": "New Document",
  "content": "# Hello World",
  "userId": "uuid",
  "isPublic": false,
  "createdAt": "2025-12-01T00:00:00.000Z",
  "updatedAt": "2025-12-01T00:00:00.000Z",
  "owner": { ... }
}
```

#### Update Document
```http
PUT /documents/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "# Updated content",
  "isPublic": true
}

Response: {
  "id": "uuid",
  "title": "Updated Title",
  "content": "# Updated content",
  "userId": "uuid",
  "isPublic": true,
  "createdAt": "2025-12-01T00:00:00.000Z",
  "updatedAt": "2025-12-01T12:00:00.000Z",
  "owner": { ... }
}
```

#### Delete Document
```http
DELETE /documents/:id
Authorization: Bearer {token}

Response: {
  "message": "Document deleted successfully"
}
```

## 🛠️ Development

### Available Scripts

#### Root Level
```bash
npm run dev              # Start all services in development mode
npm run build            # Build all packages and apps
npm run lint             # Lint all packages and apps
npm run format           # Format code with Prettier
npm run check-types      # Type-check all TypeScript files

# Individual app commands
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend
npm run build:frontend   # Build only frontend
npm run build:backend    # Build only backend
```

#### Backend (`apps/backend/`)
```bash
npm run dev              # Start development server with hot reload
npm run build            # Compile TypeScript to JavaScript
npm run start            # Start production server
npm run lint             # Lint TypeScript files
npm run format           # Format code with Prettier
```

#### Frontend (`apps/frontend/`)
```bash
npm run dev              # Start Next.js development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Lint with ESLint
npm run check-types      # Type-check without emitting
```

### Database Management

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio (GUI for database)
npx prisma studio
```

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Run linting and formatting:
```bash
npm run lint
npm run format
```

## 🎯 Key Features Implementation

### Auto-Save
Documents are automatically saved 800ms after the last edit (400ms for new documents). The editor shows a visual indicator during save operations.

### View Modes
Three view modes available:
- **Split View**: Editor and preview side-by-side
- **Editor Only**: Full-width editor
- **Preview Only**: Full-width preview

### Markdown Support
- GitHub Flavored Markdown (GFM)
- Tables, task lists, strikethrough
- Inline and block code with syntax highlighting
- Custom HTML tags for advanced formatting
- Colored highlights and blockquotes

### PDF Export
Export any document to PDF with preserved formatting, including:
- Headers and text styling
- Lists and tables
- Code blocks
- Blockquotes

## 🔒 Security Considerations

### Production Deployment

1. **Environment Variables**: Never commit `.env` files. Use secure environment variable management.

2. **JWT Secret**: Generate a strong, random JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Database**: Use strong passwords and restrict access to database.

4. **CORS**: Configure CORS to only allow requests from trusted origins.

5. **HTTPS**: Always use HTTPS in production.

6. **Rate Limiting**: Implement rate limiting for API endpoints.

7. **Input Validation**: Validate and sanitize all user inputs.

## 🚢 Deployment

### Backend Deployment

1. **Build the application**:
   ```bash
   cd apps/backend
   npm run build
   ```

2. **Set environment variables** on your hosting platform.

3. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

**Recommended Platforms**: Railway, Render, Heroku, AWS, DigitalOcean

### Frontend Deployment

1. **Build the application**:
   ```bash
   cd apps/frontend
   npm run build
   ```

2. **Set environment variables** (especially `NEXT_PUBLIC_API_URL`).

3. **Deploy** using your preferred platform.

**Recommended Platforms**: Vercel, Netlify, AWS Amplify

### Database Hosting

**Recommended Providers**:
- Neon (Serverless Postgres)
- Supabase
- Railway
- AWS RDS
- DigitalOcean Managed Databases

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write TypeScript with proper types
- Test your changes thoroughly
- Update documentation as needed
- Keep commits atomic and well-described

## 📝 Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String?
  name      String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  documents Document[]
}
```

### Document Model
```prisma
model Document {
  id        String   @id @default(uuid())
  title     String
  content   String   @db.Text
  userId    String
  isPublic  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  owner     User     @relation(fields: [userId], references: [id])
}
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9
```

#### Prisma Client Not Generated
```bash
cd apps/backend
npx prisma generate
```

#### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists and user has proper permissions

#### Frontend Can't Connect to Backend
- Verify backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is properly configured

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Express](https://expressjs.com/) - Fast, unopinionated web framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [CodeMirror](https://codemirror.net/) - Versatile text editor
- [Turborepo](https://turbo.build/) - High-performance build system
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using modern web technologies
