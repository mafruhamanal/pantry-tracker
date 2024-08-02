import { auth } from "../../Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export function handleSignUp(formdata: FormData): Promise<void> {
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up successfully
      const user = userCredential.user;
      console.log("User signed up:", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Sign up error:", errorCode, errorMessage);
    });
}

export function handleSignIn(formdata: FormData): Promise<void> {
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      console.log("User signed in:", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Sign in error:", errorCode, errorMessage);
    });
}

export function handleSignOut(): Promise<void> {
  return signOut(auth)
    .then(() => {
      // Sign-out successful
      console.log("User signed out");
    })
    .catch((error) => {
      console.error("Sign out error:", error);
    });
}
