import { SignedIn } from '@clerk/nextjs';

// @Marco, I created these routes for you, hopefully it will help.
export default function Home() {
  return <SignedIn>Hello from the dashboard!</SignedIn>;
}
