import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign up" };

export default function SignUpPage() {
  return (
    <main className="flex min-h-full items-center justify-center px-4 py-16">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-ink border border-paper/10 shadow-xl",
          },
        }}
      />
    </main>
  );
}
