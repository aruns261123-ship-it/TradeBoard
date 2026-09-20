import type { Metadata } from "next";
import { ContactForm } from "@/app/contact/contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container max-w-xl py-14">
      <h1 className="text-3xl font-extrabold tracking-tight">Contact us</h1>
      <p className="mt-2 text-muted-foreground">
        Questions about posting, billing, or the agency plan — we reply within one business day.
      </p>
      <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
        <ContactForm />
      </div>
    </div>
  );
}
