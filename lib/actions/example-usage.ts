/**
 * Example usage of the server actions
 * This file demonstrates how to use the database functions
 * that implement your apiClient.ts interface
 */

import {
  registerUser,
  assignPetsToUser,
  createUserSubscription,
} from "@/server/users/actions";
import { PetType } from "@/server/pets/types";
import {
  PaymentFrequency,
  SubscriptionType,
} from "@/server/subscriptions/types";

// Example: Complete user onboarding flow
export async function exampleUserOnboarding() {
  try {
    // 1. Register a new user
    const userResult = await registerUser({
      fullName: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword123",
    });

    if (!userResult.success) {
      console.error("Failed to register user:", userResult.error);
      return;
    }

    console.log("User registered:", userResult.data);
    const userId = userResult.data?.id;

    // 2. Assign pets to the user
    const petsResult = await assignPetsToUser({
      userId: userId!,
      pets: [
        {
          name: "Buddy",
          type: PetType.dog,
          age: 3,
          breed: "labrador",
        },
        {
          name: "Whiskers",
          type: PetType.cat,
          age: 2,
          breed: "siamese",
        },
      ],
    });

    if (!petsResult.success) {
      console.error("Failed to assign pets:", petsResult.error);
      return;
    }

    console.log("Pets assigned:", petsResult.data);

    // 3. Create a premium subscription
    const subscriptionResult = await createUserSubscription({
      userId: userId!,
      subscription: {
        type: SubscriptionType.premium,
        paymentFrequency: PaymentFrequency.monthly,
      },
    });

    if (!subscriptionResult.success) {
      console.error("Failed to create subscription:", subscriptionResult.error);
      return;
    }

    console.log("Subscription created:", subscriptionResult.data);

    return {
      user: userResult.data,
      pets: petsResult.data,
      subscription: subscriptionResult.data,
    };
  } catch (error) {
    console.error("Error in user onboarding:", error);
  }
}

// Example: Create a free subscription
export async function exampleFreeSubscription(userId: string) {
  const result = await createUserSubscription({
    userId,
    subscription: {
      type: SubscriptionType.free,
    },
  });

  return result;
}
