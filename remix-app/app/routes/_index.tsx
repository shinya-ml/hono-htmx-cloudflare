import type { MetaFunction } from "@remix-run/cloudflare";
import {GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth'
import {useAuth} from "../auth"

const handleSignIn = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(getAuth(), provider)
}

const handleSignOut = () => {
  signOut(getAuth())
}


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const user = useAuth();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      {user ?
      (
        <div>
          <button onClick={handleSignOut}>logout</button>
        </div>) :
      (<button onClick={handleSignIn}>login</button>)
      }
    </div>
  )
}
