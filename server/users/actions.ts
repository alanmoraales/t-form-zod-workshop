"use server";

import { db, users, pets, subscriptions } from "@/server/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Pet } from "@/server/pets/types";
import {
  PremiumSubscription,
  SubscriptionType,
  UserSubscription,
} from "@/server/subscriptions/types";

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
}

export async function registerUser(payload: CreateUserPayload) {
  try {
    // Hash password in a real app - using plain text for demo
    const hashedPassword = payload.password; // In production, use bcrypt or similar

    const [newUser] = await db
      .insert(users)
      .values({
        fullName: payload.fullName,
        email: payload.email,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        createdAt: users.createdAt,
      });

    revalidatePath("/users");

    return {
      success: true,
      data: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to register user",
    };
  }
}

export interface AssignPetsToUserPayload {
  pets: Pet[];
  userId: string;
}

export async function assignPetsToUser(payload: AssignPetsToUserPayload) {
  try {
    // Verify user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);
    if (user.length === 0) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Insert pets
    const petsToInsert = payload.pets.map((pet) => ({
      name: pet.name,
      type: pet.type,
      age: pet.age,
      breed: pet.breed,
      userId: payload.userId,
    }));

    const insertedPets = await db.insert(pets).values(petsToInsert).returning({
      id: pets.id,
      name: pets.name,
      type: pets.type,
      age: pets.age,
      breed: pets.breed,
      userId: pets.userId,
      createdAt: pets.createdAt,
    });

    revalidatePath("/users");
    revalidatePath("/pets");

    return {
      success: true,
      data: {
        pets: insertedPets,
        userId: payload.userId,
      },
    };
  } catch (error) {
    console.error("Error assigning pets to user:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to assign pets to user",
    };
  }
}

export interface CreateUserSubscriptionPayload {
  userId: string;
  subscription: UserSubscription;
}

export async function createUserSubscription(
  payload: CreateUserSubscriptionPayload
) {
  try {
    // Verify user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);
    if (user.length === 0) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Check if user already has a subscription
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, payload.userId))
      .limit(1);

    const subscriptionData = {
      userId: payload.userId,
      type: payload.subscription.type,
      paymentFrequency:
        payload.subscription.type === SubscriptionType.premium
          ? (payload.subscription as PremiumSubscription).paymentFrequency
          : null,
    };

    let result;

    if (existingSubscription.length > 0) {
      // Update existing subscription
      [result] = await db
        .update(subscriptions)
        .set({
          ...subscriptionData,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.userId, payload.userId))
        .returning();
    } else {
      // Create new subscription
      [result] = await db
        .insert(subscriptions)
        .values(subscriptionData)
        .returning();
    }

    revalidatePath("/users");
    revalidatePath("/subscriptions");

    return {
      success: true,
      data: {
        userId: result.userId,
        subscription: {
          id: result.id,
          type: result.type,
          paymentFrequency: result.paymentFrequency,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        },
      },
    };
  } catch (error) {
    console.error("Error creating user subscription:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create user subscription",
    };
  }
}
