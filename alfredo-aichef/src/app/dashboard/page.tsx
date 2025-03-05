import { SignedIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

// @Marco, I created these routes for you, hopefully it will help.
export default async function Home() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return <SignedIn>Hello, {userId}</SignedIn>;
}
