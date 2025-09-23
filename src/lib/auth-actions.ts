"use server";

import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";

async function syncUser(user: User, role: string | null) {
  try {
    const idToken = await user.getIdToken();
    // The user mentioned Prisma and Neon, which I can't use.
    // This is a placeholder for a call to a Next.js API route.
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/sync-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
            firebaseUid: user.uid,
            email: user.email,
            // Role can be assigned based on business logic, defaulting to 'student'
            role: role || 'student' 
        })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'User sync failed');
    }
    return await response.json();
  } catch (error) {
    console.error("User sync failed:", error);
    // Depending on the use case, you might want to handle this more gracefully
    throw error;
  }
}

export async function signUpWithEmail(email: string, password: string, role: string | null):Promise<{result?:any, error?:any}> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await syncUser(userCredential.user, role);
    return { result: userCredential };
  } catch (error: any) {
    return { error };
  }
}

async function socialSignIn(provider: GoogleAuthProvider | GithubAuthProvider, role: string | null):Promise<{result?:any, error?:any}> {
    try {
        const result = await signInWithPopup(auth, provider);
        await syncUser(result.user, role);
        return { result };
    } catch (error) {
        return { error };
    }
}

export async function signInWithGoogle(role: string | null):Promise<{result?:any, error?:any}> {
  const provider = new GoogleAuthProvider();
  return socialSignIn(provider, role);
}

export async function signInWithGitHub(role: string | null):Promise<{result?:any, error?:any}> {
  const provider = new GithubAuthProvider();
  return socialSignIn(provider, role);
}
