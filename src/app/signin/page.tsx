import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/app/signin/auth-form";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <div className="container flex max-w-md flex-col py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-muted-foreground">
        Sign in to manage your job posts and applicants.
      </p>
      <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
        <Suspense>
          <AuthForm mode="signin" />
        </Suspense>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Create an employer account
        </Link>
      </p>
    </div>
  );
}
