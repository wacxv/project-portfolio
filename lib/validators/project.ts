import { z } from "zod";

import { projectStatusValues } from "@/db/schema";

const optionalUrl = z.url().optional().nullable();

const galleryImageSchema = z.object({
  url: z.url(),
  path: z.string().min(1),
});

const projectFields = {
  title: z.string().trim().min(1),
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain lowercase letters, numbers, and single hyphens.",
    ),
  summary: z.string().trim().optional().nullable(),
  description: z.string().optional().nullable(),
  techTags: z.array(z.string().trim().min(1)).default([]).transform((tags) => [...new Set(tags)]),
  coverImageUrl: optionalUrl,
  coverImagePath: z.string().trim().min(1).optional().nullable(),
  gallery: z.array(galleryImageSchema).default([]),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.enum(projectStatusValues).default("draft"),
};

export const createProjectSchema = z.object(projectFields);
export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
