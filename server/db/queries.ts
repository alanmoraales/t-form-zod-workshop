import { db, users, pets, subscriptions } from "@/server/db";
import { eq } from "drizzle-orm";

// User queries
export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result[0] || null;
}

export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0] || null;
}

export async function getAllUsers() {
  return await db.select().from(users);
}

// Pet queries
export async function getPetsByUserId(userId: string) {
  return await db.select().from(pets).where(eq(pets.userId, userId));
}

export async function getPetById(id: string) {
  const result = await db.select().from(pets).where(eq(pets.id, id)).limit(1);

  return result[0] || null;
}

export async function getAllPets() {
  return await db.select().from(pets);
}

// Subscription queries
export async function getSubscriptionByUserId(userId: string) {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  return result[0] || null;
}

export async function getAllSubscriptions() {
  return await db.select().from(subscriptions);
}

// Complex queries with relations
export async function getUserWithPetsAndSubscription(userId: string) {
  const user = await getUserById(userId);
  if (!user) return null;

  const userPets = await getPetsByUserId(userId);
  const userSubscription = await getSubscriptionByUserId(userId);

  return {
    ...user,
    pets: userPets,
    subscription: userSubscription,
  };
}

export async function getUsersWithPetCount() {
  return await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users);
}

// Delete operations
export async function deleteUser(id: string) {
  return await db.delete(users).where(eq(users.id, id));
}

export async function deletePet(id: string) {
  return await db.delete(pets).where(eq(pets.id, id));
}

export async function deleteSubscription(userId: string) {
  return await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
}
