import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      console.error("Auth Error: No user found.");
      return new NextResponse("Ain't nobody got time fo dat'", { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      console.error("Auth Error: User has no email.");
      return NextResponse.json(
        { error: "Ain't nobody got time fo dat'" },
        { status: 401 }
      );
    }

    const domain = email.split("@")[1];

    if (domain !== "students.opit.com") {
      try {
        const clerk = await clerkClient();
        // Delete user if email domain is not valid
        await clerk.users.deleteUser(user.id);

        // Return response indicating the user was deleted
        return NextResponse.json({ message: "User deleted" }, { status: 200 });
      } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
          { error: "Error deleting user" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ user: { id: user.id, email } });
  } catch (error) {
    console.error("Internal Server Error in auth-check:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
