# WisePrompt - AI Prompt Marketplace

WisePrompt is a Web2/Web3 hybrid application for discovering, buying, and selling AI prompts.

## Tech Stack

- **Frontend**: Next.js, RainbowKit, wagmi, viem
- **Backend**: Nest.js, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT with EIP-4361 (Sign-In with Ethereum)
- **Deployment**: Docker, Docker Compose

## Getting Started with Docker

### Prerequisites

- Docker and Docker Compose installed on your machine
- Git

### Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/wiseprompt.git
   cd wiseprompt
   ```

2. Copy the environment file:

   ```bash
   cp .env.sample .env
   ```

3. Start the application in production mode:

   ```bash
   docker-compose up -d
   ```

4. Or start the application in development mode with hot-reloading:

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - API Documentation: http://localhost:3001/docs

### Services

The application consists of three main services:

- **Frontend** (Next.js) - Port 3000
- **Backend API** (Nest.js) - Port 3001
- **Database** (PostgreSQL) - Port 5432

### Database Management

The PostgreSQL database is persisted using Docker volumes. You can access it directly using:

```bash
docker exec -it wiseprompt-db psql -U postgres -d wiseprompt
```

To run database migrations:

```bash
docker exec -it wiseprompt-api npm run prisma:migrate:dev
```

## Development Workflow

### Running in Development Mode

Development mode provides hot-reloading for both frontend and backend:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f db
```

### Stopping the Application

```bash
# Production
docker-compose down

# Development
docker-compose -f docker-compose.dev.yml down
```

### Rebuilding the Containers

```bash
# Production
docker-compose up -d --build

# Development
docker-compose -f docker-compose.dev.yml up -d --build
```

## Project Structure

```
wiseprompt/
├── api/                 # Backend (Nest.js)
│   ├── prisma/          # Prisma schema and migrations
│   ├── src/             # Source code
│   ├── Dockerfile       # Production Dockerfile
│   └── Dockerfile.dev   # Development Dockerfile
├── frontend/            # Frontend (Next.js)
│   ├── components/      # React components
│   ├── pages/           # Next.js pages
│   ├── public/          # Static assets
│   ├── Dockerfile       # Production Dockerfile
│   └── Dockerfile.dev   # Development Dockerfile
├── docker-compose.yml         # Production Docker Compose
├── docker-compose.dev.yml     # Development Docker Compose
└── .env.sample                # Sample environment variables
```

## Environment Variables

See `.env.sample` for a list of required environment variables.

## License

[MIT](LICENSE)
