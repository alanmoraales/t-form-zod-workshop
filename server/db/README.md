# Pet Hotel Database Implementation

This directory contains the complete database implementation for your pet hotel application using Drizzle ORM.

## Overview

The implementation includes:

- **Database Schema**: Tables for users, pets, and subscriptions
- **Server Actions**: Functions that match your `apiClient.ts` interface
- **Query Utilities**: Helper functions for common database operations
- **Type Safety**: Full TypeScript support with inferred types

## Database Schema

### Users Table

- `id`: Primary key (UUID)
- `fullName`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `createdAt` / `updatedAt`: Timestamps

### Pets Table

- `id`: Primary key (UUID)
- `name`: Pet's name
- `type`: "dog" or "cat"
- `age`: Pet's age in years
- `breed`: Specific breed based on type
- `userId`: Foreign key to users table

### Subscriptions Table

- `id`: Primary key (UUID)
- `userId`: Foreign key to users table (unique)
- `type`: "free" or "premium"
- `paymentFrequency`: "monthly" or "yearly" (for premium only)

## Server Actions

### `registerUser(payload: CreateUserPayload)`

Creates a new user account in the database.

```typescript
const result = await registerUser({
  fullName: "John Doe",
  email: "john@example.com",
  password: "securepassword",
});
```

### `assignPetsToUser(payload: AssignPetsToUserPayload)`

Assigns one or more pets to a user.

```typescript
const result = await assignPetsToUser({
  userId: "user-id",
  pets: [
    {
      name: "Buddy",
      type: "dog",
      age: 3,
      breed: "labrador",
    },
  ],
});
```

### `createUserSubscription(payload: CreateUserSubscriptionPayload)`

Creates or updates a user's subscription.

```typescript
const result = await createUserSubscription({
  userId: "user-id",
  subscription: {
    type: "premium",
    paymentFrequency: "monthly",
  },
});
```

## Database Commands

- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run pending migrations
- `npm run db:studio` - Open Drizzle Studio for database management

## Usage Example

See `lib/actions/example-usage.ts` for a complete example of the user onboarding flow.

## Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="file:./sqlite.db"
# DATABASE_AUTH_TOKEN="" # Only for remote databases
```

## Type Safety

All database operations are fully typed. The schema exports inferred types:

- `User` / `NewUser` - User table types
- `Pet` / `NewPet` - Pet table types
- `Subscription` / `NewSubscription` - Subscription table types

## Relations

The schema includes proper relations between tables:

- Users have many pets
- Users have one subscription
- Pets belong to one user
- Subscriptions belong to one user
