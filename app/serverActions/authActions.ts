
import { auth } from "../../Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, collection, setDoc } from "firebase/firestore";
import { firestore } from "../../Firebase";

interface AuthCredentials {
  email: string;
  password: string;
  username?: string;
}

export async function handleSignUp({
  email,
  password,
  username,
}: AuthCredentials): Promise<void> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user: User = userCredential.user;

    // Create user document in Firestore
    const userDocRef = doc(firestore, `users/${user.uid}`);
    await setDoc(userDocRef, { username: username || user.email });

    // Initialize inventory subcollection
    const inventoryCollectionRef = collection(
      firestore,
      `users/${user.uid}/inventory`
    );
    // Optionally, add default items here
    // For example:
    // await setDoc(doc(inventoryCollectionRef, 'item1'), { name: 'Example Item', quantity: 10 });

    // Update user profile with displayName
    if (username) {
      await updateProfile(user, { displayName: username });
    }

    console.log("User signed up and inventory initialized:", user);
  } catch (error) {
    if (error instanceof Error) {
      // Handle known error types
      console.error("Sign up error:", error.message);
      throw new Error(error.message);
    } else {
      // Handle unknown error types
      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export function handleSignIn({
  email,
  password,
}: AuthCredentials): Promise<void> {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user: User = userCredential.user;
      console.log("User signed in:", user);
      // Optionally, fetch user-specific inventory here if needed
    })
    .catch((error) => {
      console.error("Sign in error:", error.code, error.message);
      throw new Error(error.message);
    });
}

export function handleSignOut(): Promise<void> {
  return signOut(auth)
    .then(() => {
      console.log("User signed out");
      // Optionally, clear local state or handle sign-out logic here
    })
    .catch((error) => {
      console.error("Sign out error:", error.message);
      throw new Error(error.message);
    });
}
