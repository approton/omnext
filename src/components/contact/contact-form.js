"use client";

import { useState } from "react";
import styles from "./contact-form.module.css";

export default function ContactForm() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setStatus("sending");

    try {
      const response = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.get("name"),
          email: values.get("email"),
          company: values.get("company"),
          topic: values.get("topic"),
          message: values.get("message"),
          consent: values.get("consent") === "true",
          website: values.get("website"),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          result?.error?.message || "We could not send your enquiry. Please try again.",
        );
      }
      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus(error.message || "error");
    }
  }
  return (
    <div className={styles.formCard} data-interactive data-depth="2">
      <form onSubmit={handleSubmit} onChange={() => status !== "sending" && setStatus("idle")}>
        <label className={styles.honeypot} aria-hidden="true" tabIndex={-1}>
          Leave this field empty
          <input name="website" autoComplete="off" tabIndex={-1} />
        </label>
        <div className={styles.twoCol}>
          <label>
            Full name <b className={styles.required}>*</b>
            <input name="name" autoComplete="name" required maxLength={120} />
          </label>
          <label>
            Work email <b className={styles.required}>*</b>
            <input name="email" type="email" autoComplete="email" required maxLength={254} />
          </label>
        </div>
        <label>
          Company <small>(optional)</small>
          <input name="company" autoComplete="organization" maxLength={160} />
        </label>
        <label>
          What would you like to discuss? <b className={styles.required}>*</b>
          <select name="topic" required defaultValue="">
            <option value="" disabled>
              Select a topic
            </option>
            <option>Digital product engineering</option>
            <option>Cloud & platform</option>
            <option>Data & intelligent systems</option>
            <option>Technology advisory</option>
            <option>Something else</option>
          </select>
        </label>
        <label>
          Message <b className={styles.required}>*</b>
          <textarea
            name="message"
            rows="5"
            required
            minLength={10}
            maxLength={4000}
            placeholder="A few details about the challenge, opportunity or idea…"
          />
        </label>
        <label className={styles.consent}>
          <input type="checkbox" name="consent" value="true" required />
          <span>
            I agree that Omnext may use these details to respond to this enquiry. <b>*</b>
          </span>
        </label>
        <button className={styles.submit} type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending enquiry…" : "Send enquiry"}
          <span aria-hidden="true">{status === "sending" ? "…" : "→"}</span>
        </button>
        <p className={styles.formNote}>
          Your enquiry is sent securely and stored for the Omnext team.
        </p>
        {status === "success" && (
          <p className={styles.status} role="status" aria-live="polite">
            Thank you. Your enquiry has been received and securely saved for the Omnext team.
          </p>
        )}
        {status !== "idle" && status !== "sending" && status !== "success" && (
          <p className={styles.error} role="alert" aria-live="assertive">
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
