# WisePrompt API Specification

## Authentication

WisePrompt uses EIP-4361 (Sign-In with Ethereum) for authentication. Users authenticate by signing a message with their wallet and receive a JWT token in response.

### JWT Structure

```json
{
  "sub": "0x123...", // wallet address
  "iat": 1682000000, // issued at timestamp
  "exp": 1682086400, // expiration timestamp
  "iss": "wiseprompt.io" // issuer
}
```

### Authentication Endpoints

#### Sign-In Request

```
POST /auth/nonce
```

Response:

```json
{
  "nonce": "random-string-for-signing",
  "expiresAt": "2023-04-21T12:00:00Z"
}
```

#### Verify Signature

```
POST /auth/verify
```

Request:

```json
{
  "signature": "0x...",
  "address": "0x...",
  "nonce": "random-string-for-signing"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Prompts API

### Search Prompts

```
GET /prompts
```

Query Parameters:

- `q` - Search query
- `aiAgent` - Filter by AI agent (e.g., "gpt4", "claude", "gemini")
- `tags` - Filter by tags (comma-separated)
- `minRating` - Minimum rating (1-5)
- `sort` - Sort by: "newest", "popular", "top-rated"
- `page` - Page number
- `limit` - Results per page

Response:

```json
{
  "results": [
    {
      "id": "prompt-id",
      "title": "Prompt Title",
      "preview": "Preview text...",
      "aiAgent": "gpt4",
      "tags": ["productivity", "coding"],
      "rating": 4.7,
      "ratingCount": 123,
      "price": "5.00",
      "currency": "USDC",
      "createdAt": "2023-04-15T10:30:00Z",
      "author": {
        "address": "0x123..."
      }
    }
  ],
  "pagination": {
    "total": 243,
    "page": 1,
    "limit": 10,
    "pages": 25
  }
}
```

### Get Prompt Details

```
GET /prompts/:id
```

Response:

```json
{
  "id": "prompt-id",
  "title": "Prompt Title",
  "preview": "Preview text...",
  "content": "Full prompt content if purchased",
  "aiAgent": "gpt4",
  "tags": ["productivity", "coding"],
  "rating": 4.7,
  "ratingCount": 123,
  "price": "5.00",
  "currency": "USDC",
  "createdAt": "2023-04-15T10:30:00Z",
  "isPurchased": false,
  "author": {
    "address": "0x123..."
  }
}
```

### Purchase Prompt

```
POST /prompts/:id/purchase
```

Authorization: Bearer JWT

Request:

```json
{
  "transactionHash": "0x..." // Hash of the transaction
}
```

Response:

```json
{
  "id": "prompt-id",
  "title": "Prompt Title",
  "content": "Full prompt content",
  "purchaseId": "purchase-id",
  "purchasedAt": "2023-04-21T14:30:00Z"
}
```

### Rate Prompt

```
POST /prompts/:id/rate
```

Authorization: Bearer JWT

Request:

```json
{
  "rating": 5, // 1-5
  "comment": "This prompt is excellent!"
}
```

Response:

```json
{
  "id": "rating-id",
  "promptId": "prompt-id",
  "rating": 5,
  "comment": "This prompt is excellent!",
  "createdAt": "2023-04-21T15:00:00Z"
}
```

### Create Prompt

```
POST /prompts
```

Authorization: Bearer JWT

Request:

```json
{
  "title": "My New Prompt",
  "content": "The full prompt content",
  "preview": "A preview of the prompt",
  "aiAgent": "gpt4",
  "tags": ["productivity", "coding"],
  "price": "5.00",
  "currency": "USDC"
}
```

Response:

```json
{
  "id": "new-prompt-id",
  "title": "My New Prompt",
  "content": "The full prompt content",
  "preview": "A preview of the prompt",
  "aiAgent": "gpt4",
  "tags": ["productivity", "coding"],
  "price": "5.00",
  "currency": "USDC",
  "createdAt": "2023-04-21T16:00:00Z",
  "author": {
    "address": "0x..."
  }
}
```

## Database Schema

### Prompts Table

```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  preview TEXT NOT NULL,
  ai_agent VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  author_address VARCHAR(42) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Prompt_Tags Table

```sql
CREATE TABLE prompt_tags (
  prompt_id UUID REFERENCES prompts(id),
  tag VARCHAR(50) NOT NULL,
  PRIMARY KEY (prompt_id, tag)
);
```

### Purchases Table

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id UUID REFERENCES prompts(id),
  buyer_address VARCHAR(42) NOT NULL,
  transaction_hash VARCHAR(66) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  purchased_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Ratings Table

```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id UUID REFERENCES prompts(id),
  rater_address VARCHAR(42) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (prompt_id, rater_address)
);
```

## Authorization

All endpoints that require authentication must include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The server will extract the wallet address from the `sub` claim in the JWT and use it for authorization checks:

1. Only the owner of a prompt can edit or delete it
2. Users can only rate a prompt once
3. Users can only rate prompts they've purchased
4. Any wallet can search and view prompt previews

## Docker Configuration

Both frontend and backend will be containerized using Docker:

### Backend (api/Dockerfile)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

### Frontend (app/Dockerfile)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose (docker-compose.yml)

```yaml
version: "3"
services:
  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/wiseprompt
      - JWT_SECRET=your-jwt-secret-here
    depends_on:
      - db
    restart: always

  app:
    build: ./app
    ports:
      - "3001:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3000
    restart: always

  db:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=wiseprompt
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```
