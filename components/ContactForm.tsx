"use client";

import { useState, type FormEvent } from "react";

import {
  submitContactForm,
  type ContactFormResult,
} from "@/app/actions/contact";

type ContactField = "name" | "email" | "message";
type FieldErrors = Partial<Record<ContactField, string>>;

const initialValues = { name: "", email: "", message: "", website: "" };

function validate(values: typeof initialValues): FieldErrors {
  const errors: FieldErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Please include a little more detail.";
  }

  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function updateField(field: keyof typeof initialValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (field !== "website" && fieldErrors[field]) {
      setFieldErrors((current) => ({ ...current, [field]: undefined }));
    }
    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate(values);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      setMessage("Please check the highlighted fields.");
      return;
    }

    setFieldErrors({});
    setStatus("sending");
    setMessage("");

    const result: ContactFormResult = await submitContactForm(new FormData(event.currentTarget));

    if (result.status === "success") {
      setValues(initialValues);
      setStatus("success");
      setMessage("Thanks for reaching out. I’ll get back to you soon.");
      return;
    }

    const serverErrors: FieldErrors = {};
    for (const field of ["name", "email", "message"] as const) {
      const error = result.fieldErrors?.[field]?.[0];
      if (error) {
        serverErrors[field] = error;
      }
    }
    setFieldErrors(serverErrors);
    setStatus("error");
    setMessage(result.message);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="honeypot-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          value={values.website}
          onChange={(event) => updateField("website", event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-field">
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
          autoComplete="name"
          required
        />
        {fieldErrors.name && <p id="contact-name-error" className="field-error">{fieldErrors.name}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
          autoComplete="email"
          required
        />
        {fieldErrors.email && <p id="contact-email-error" className="field-error">{fieldErrors.email}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
          rows={6}
          required
        />
        {fieldErrors.message && <p id="contact-message-error" className="field-error">{fieldErrors.message}</p>}
      </div>

      <button className="contact-submit" type="submit" disabled={status === "sending"}>
        {status === "sending" && <span className="button-spinner" aria-hidden="true" />}
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      <p className={`form-status form-status-${status}`} role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
