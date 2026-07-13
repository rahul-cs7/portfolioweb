"use client";

import { FormEvent, useState } from "react";
import { Icon } from "./Icons";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = event.currentTarget;
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (response.ok) {
      setState("sent");
      form.reset();
    } else setState("error");
  }

  return (
    <form className="contact-form glass" onSubmit={submit}>
      <div className="form-row">
        <label><span>Name</span><input name="name" required minLength={2} placeholder="Your name" /></label>
        <label><span>Email</span><input name="email" required type="email" placeholder="you@company.com" /></label>
      </div>
      <label><span>Subject</span><input name="subject" required minLength={3} placeholder="Let’s build something useful" /></label>
      <label><span>Message</span><textarea name="message" required minLength={10} rows={5} placeholder="Tell me a little about your idea or opportunity..." /></label>
      <input className="honey" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="button primary submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : state === "sent" ? "Message received" : "Send message"}<Icon name={state === "sent" ? "arrow" : "mail"} />
      </button>
      <p className={`form-note ${state}`} aria-live="polite">
        {state === "sent" && "Thanks — I’ll get back to you soon."}
        {state === "error" && "Something went wrong. Please email me directly at rahuluu2327@gmail.com."}
      </p>
    </form>
  );
}
