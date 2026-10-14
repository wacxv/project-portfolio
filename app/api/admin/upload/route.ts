import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { z } from "zod";

import { getSession } from "@/lib/auth";
import { COVER_IMAGE_PREFIX, COVER_IMAGE_TYPES, MAX_COVER_IMAGE_BYTES } from "@/lib/blob-upload";

const uploadRequest = z.object({
  type: z.literal("blob.generate-client-token"),
  payload: z.object({
    pathname: z.string().regex(/^project-covers\/[a-zA-Z0-9_-]+\.(?:jpg|png|webp|avif)$/),
    clientPayload: z.string().nullable().default(null),
    multipart: z.boolean().default(false),
  }),
});

export async function POST(request: Request): Promise<Response> {
  const session = await getSession();
  if (!session || session.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
    return Response.json({ error: "Sign in as the admin to upload images." }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: "Set BLOB_READ_WRITE_TOKEN on the server and restart or redeploy." }, { status: 503 });
  }
  let body: HandleUploadBody;
  try {
    const parsed = uploadRequest.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Invalid image upload request." }, { status: 400 });
    body = parsed.data;
  } catch {
    return Response.json({ error: "Invalid image upload request." }, { status: 400 });
  }
  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(COVER_IMAGE_PREFIX)) throw new Error("Invalid upload path.");
        return {
          allowedContentTypes: COVER_IMAGE_TYPES,
          maximumSizeInBytes: MAX_COVER_IMAGE_BYTES,
          addRandomSuffix: true,
          allowOverwrite: false,
          validUntil: Date.now() + 10 * 60 * 1000,
        };
      },
    });
    return Response.json(result);
  } catch {
    return Response.json({ error: "Could not authorize the upload. Check your Blob token and public store configuration." }, { status: 400 });
  }
}
