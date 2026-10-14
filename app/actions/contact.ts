"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Please keep your name under 100 characters."),
  email: z.string().trim().email("Please enter a valid email address.").max(254, "Please enter a valid email address."),
  message: z.string().trim().min(10, "Please include a little more detail.").max(5000, "Please keep your message under 5,000 characters."),
  website: z.string(),
});

type ContactField = "name" | "email" | "message";

export type ContactFormResult =
  | { status: "success" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<ContactField, string[]>>;
    };

const submissionsByIp = new Map<string, number[]>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function getStringValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

function getClientIp(requestHeaders: Headers): string {
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recentSubmissions = (submissionsByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_WINDOW_MS,
  );

  if (recentSubmissions.length >= RATE_LIMIT) {
    submissionsByIp.set(ip, recentSubmissions);
    return true;
  }

  submissionsByIp.set(ip, [...recentSubmissions, now]);
  return false;
}

export async function submitContactForm(formData: FormData): Promise<ContactFormResult> {
  const website = getStringValue(formData.get("website"));

  if (website) {
    return { status: "success" };
  }

  const validatedFields = contactSchema.safeParse({
    name: getStringValue(formData.get("name")),
    email: getStringValue(formData.get("email")),
    message: getStringValue(formData.get("message")),
    website,
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: {
        name: fieldErrors.name,
        email: fieldErrors.email,
        message: fieldErrors.message,
      },
    };
  }

  const requestHeaders = await headers();
  if (isRateLimited(getClientIp(requestHeaders))) {
    return {
      status: "error",
      message: "I’m receiving a lot of messages right now. Please try again in a little while.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error("Contact form email settings are not configured.");
    return {
      status: "error",
      message: "The contact form is temporarily unavailable. Please email me directly instead.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: validatedFields.data.email,
      subject: `Portfolio contact from ${validatedFields.data.name}`,
      text: [
        `Name: ${validatedFields.data.name}`,
        `Email: ${validatedFields.data.email}`,
        "",
        validatedFields.data.message,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend failed to send contact form email.", error);
      return {
        status: "error",
        message: "I couldn’t send your message just now. Please try again or email me directly.",
      };
    }
  } catch (error) {
    console.error("Contact form email request failed.", error);
    return {
      status: "error",
      message: "I couldn’t send your message just now. Please try again or email me directly.",
    };
  }

  return { status: "success" };
}
