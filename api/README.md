# WisePrompt API

## Description

The WisePrompt API serves as the backend for the WisePrompt application, providing a Web2/Web3 hybrid interface for AI prompts.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

The project uses Vitest for testing.

```bash
# run all unit tests
$ npm run test

# run tests in watch mode
$ npm run test:watch

# run test coverage
$ npm run test:cov

# run end-to-end tests
$ npm run test:e2e
```

## API Key Authentication

The API supports two authentication methods:

1. **JWT Authentication**: Standard JWT auth for user sessions, typically obtained after wallet authentication.
2. **API Key Authentication**: Long-lived API keys for programmatic access.

API Keys can be created, retrieved, and revoked through the `/api-keys` endpoints.

### Authentication Methods

The API provides flexibility in auth methods:

- `@JwtAuth()` - Requires JWT authentication only
- `@ApiKeyAuth()` - Requires API key authentication only
- `@JwtOrApiKeyAuth()` - Accepts either JWT or API key authentication

### API Key Usage

API keys can be used in HTTP requests in two ways:

1. Via the `X-API-Key` header:

   ```
   X-API-Key: your-api-key-here
   ```

2. Via the `Authorization` header:
   ```
   Authorization: ApiKey your-api-key-here
   ```

## License

This project is [MIT licensed](LICENSE).

## Technologies

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication with EIP-4361 (Sign-In with Ethereum)
- API Key Authentication for Server-to-Server Communication

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your environment variables (copy `.env.example` to `.env` and fill in the values):

   ```bash
   cp .env.example .env
   ```

3. Run the Prisma migration to set up your database:

   ```bash
   npm run prisma:migrate:dev
   ```

4. Start the development server:

   ```bash
   npm run start:dev
   ```

5. Access the API at `http://localhost:3001/api`
6. Access the API documentation at `http://localhost:3001/docs`

## API Endpoints

### Authentication

- `POST /api/auth/nonce` - Get a nonce for wallet authentication
- `POST /api/auth/verify` - Verify a signed message and get a JWT token
- `GET /api/auth/me` - Get information about the authenticated user

### API Keys

- `POST /api/api-keys` - Create a new API key (authenticated with JWT)
- `GET /api/api-keys` - List all API keys for the authenticated user (authenticated with JWT)
- `DELETE /api/api-keys/:id` - Revoke an API key (authenticated with JWT)

### Prompts

- `GET /api/prompts` - Search for prompts with filters (requires API key)
- `GET /api/prompts/:id` - Get a specific prompt by ID (requires API key)
- `POST /api/prompts` - Create a new prompt (requires API key)
- `POST /api/prompts/:id/purchase` - Purchase a prompt (requires API key)
- `POST /api/prompts/:id/rating` - Rate a prompt (requires API key)

## Authentication Flow

### User Authentication (JWT)

The API uses EIP-4361 (Sign-In with Ethereum) for user authentication:

1. Client requests a nonce from the server
2. User signs the nonce with their Ethereum wallet
3. Client sends the signature back to the server
4. Server verifies the signature and issues a JWT token
5. Client includes the JWT token in subsequent API requests

### API Key Authentication (for Server-to-Server)

All endpoints except authentication and API key management require an API key:

1. Users generate API keys through the API or frontend interface
2. API keys are associated with a specific wallet address
3. API keys must be included in the `X-API-Key` header or `Authorization: ApiKey YOUR_KEY` header format
4. API keys can be revoked and have optional expiration

## API Endpoint Details

### GET /api/prompts

Search for prompts based on various filters.

**Authentication Required:** API Key

**Query Parameters:**

- `q` (string, optional) - Search query
- `aiAgent` (string, optional) - AI agent to filter by
- `tags` (string, optional) - Comma-separated tags to filter by
- `minRating` (number, optional) - Minimum rating (0-10)
- `sort` (string, optional) - Sort option (newest, popular, top-rated, price-low, price-high)
- `page` (number, optional, default: 1) - Page number
- `limit` (number, optional, default: 10) - Results per page

**Response:**

```json
{
  "results": [
    {
      "id": "uuid",
      "name": "Prompt Name",
      "goal": "Prompt Goal",
      "description": "Prompt Description",
      "testedAiAgents": ["GPT-4", "Claude"],
      "tags": ["productivity", "writing"],
      "rating": 8.5,
      "ratingCount": 10,
      "price": 5.0,
      "currency": "USDC",
      "createdAt": "2023-05-01T00:00:00Z",
      "author": {
        "address": "0x1234..."
      }
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### GET /api/prompts/:id

Get a specific prompt by ID.

**Authentication Required:** API Key

**Path Parameters:**

- `id` (string, required) - Prompt ID

**Response:**

```json
{
  "id": "uuid",
  "name": "Prompt Name",
  "goal": "Prompt Goal",
  "description": "Prompt Description",
  "content": "Full prompt content (only if purchased or author)",
  "testedAiAgents": ["GPT-4", "Claude"],
  "tags": ["productivity", "writing"],
  "rating": 8.5,
  "ratingCount": 10,
  "price": 5.0,
  "currency": "USDC",
  "promptVersion": "1.0.0",
  "createdAt": "2023-05-01T00:00:00Z",
  "updatedAt": "2023-05-01T00:00:00Z",
  "isPurchased": false,
  "isAuthor": false,
  "hasRated": false,
  "author": {
    "address": "0x1234..."
  }
}
```

### POST /api/api-keys

Create a new API key.

**Authentication Required:** JWT

**Request Body:**

```json
{
  "name": "Production Server",
  "expiresInDays": 90
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Production Server",
  "key": "your-new-api-key-here",
  "expiresAt": "2023-08-01T00:00:00Z",
  "createdAt": "2023-05-01T00:00:00Z"
}
```

## Error Handling

The API returns standard HTTP status codes and error messages:

- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required or invalid API key
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error responses include a message explaining the error:

```json
{
  "statusCode": 401,
  "message": "Invalid API key",
  "error": "Unauthorized"
}
```
