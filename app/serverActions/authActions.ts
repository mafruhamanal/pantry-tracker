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

    const userDocRef = doc(firestore, `users/${user.uid}`);
    await setDoc(userDocRef, { username: username || user.email });

    const inventoryCollectionRef = collection(
      firestore,
      `users/${user.uid}/inventory`
    );
    if (username) {
      await updateProfile(user, { displayName: username });
    }

    console.log("User signed up and inventory initialized:", user);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Sign up error:", error.message);
      throw new Error(error.message);
    } else {
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
    })
    .catch((error) => {
      console.error("Sign out error:", error.message);
      throw new Error(error.message);
    });
}
