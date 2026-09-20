import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/app/signin/auth-form";

export const metadata: Metadata = { title: "Create employer account" };

export default function SignUpPage() {
  return (
    <div className="container flex max-w-md flex-col py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Create your employer account</h1>
      <p className="mt-2 text-muted-foreground">
        Post jobs, manage listings, and review applicants — all in one dashboard.
      </p>
      <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
        <Suspense>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/signin" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
