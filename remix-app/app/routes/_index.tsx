import type { MetaFunction } from "@remix-run/cloudflare";
import {GoogleAuthProvider, getAuth, onAuthStateChanged,signInWithPopup } from 'firebase/auth'

// Initialize Firebase
const handleSignIn = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(getAuth(), provider)
}


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      console.log(user);
    } else {
      console.log("no user");
    }
  })
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <button onClick={handleSignIn}>login</button>
    </div>
  );
}
