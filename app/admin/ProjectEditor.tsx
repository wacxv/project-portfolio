"use client";

import { useActionState, useId, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { Project } from "@/db/schema";
import { COVER_IMAGE_TYPES, MAX_COVER_IMAGE_BYTES, COVER_IMAGE_PREFIX } from "@/lib/blob-upload";
import { deleteProject, saveProject } from "./actions";

export default function ProjectEditor({ project }: { project?: Project }) {
  const prefix = useId();
  const [state, action, pending] = useActionState(saveProject, {});
  const [deleteState, remove, deleting] = useActionState(deleteProject, {});
  const [coverUrl, setCoverUrl] = useState(project?.coverImageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  async function uploadCover(file: File): Promise<void> {
    setUploadError("");
    setUploadMessage("");
    if (!COVER_IMAGE_TYPES.includes(file.type) || file.size === 0 || file.size > MAX_COVER_IMAGE_BYTES) {
      setUploadError("Choose a JPEG, PNG, WebP, or AVIF image up to 10 MB.");
      return;
    }
    setUploading(true);
    try {
      const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
      const blob = await upload(`${COVER_IMAGE_PREFIX}${crypto.randomUUID()}.${extension}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        contentType: file.type,
      });
      setCoverUrl(blob.url);
      setUploadMessage("Image uploaded. Save the project to use it as the cover.");
    } catch {
      setUploadError("Upload failed. Check that you are signed in and your public Blob store token is configured, then try again.");
    } finally {
      setUploading(false);
    }
  }
  const fields = [
    { name: "title", label: "Title", value: project?.title, required: true },
    { name: "slug", label: "Slug (lowercase, separated by hyphens)", value: project?.slug, required: true },
    { name: "techTags", label: "Technologies (comma separated)", value: project?.techTags.join(", ") },
    { name: "liveUrl", label: "Live demo URL", value: project?.liveUrl, type: "url" },
    { name: "repoUrl", label: "Repository URL", value: project?.repoUrl, type: "url" },
  ];
  return (
    <div className="admin-editor">
      <form action={action} className="admin-project-form">
        {project && <input type="hidden" name="id" value={project.id} />}
        {fields.map((field) => (
          <div className="form-field" key={field.name}>
            <label htmlFor={`${prefix}-${field.name}`}>{field.label}</label>
            <input id={`${prefix}-${field.name}`} name={field.name} type={field.type ?? "text"} defaultValue={field.value ?? ""} required={field.required} />
          </div>
        ))}
        <div className="form-field">
          <label htmlFor={`${prefix}-cover-upload`}>Upload cover image</label>
          <input id={`${prefix}-cover-upload`} type="file" accept={COVER_IMAGE_TYPES.join(",")} disabled={uploading || pending || deleting} aria-describedby={`${prefix}-cover-help`} onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            if (file) void uploadCover(file);
          }} />
          <p id={`${prefix}-cover-help`}>JPEG, PNG, WebP, or AVIF, up to 10 MB. Selecting an image starts the upload.</p>
          {uploading && <p role="status">Uploading image…</p>}
          {uploadError && <p className="admin-error" role="alert">{uploadError}</p>}
          {uploadMessage && <p role="status">{uploadMessage}</p>}
          <label htmlFor={`${prefix}-cover-url`}>Cover image URL</label>
          <input id={`${prefix}-cover-url`} name="coverImageUrl" type="url" value={coverUrl} onChange={(event) => setCoverUrl(event.target.value)} disabled={uploading} />
        </div>
        <div className="form-field">
          <label htmlFor={`${prefix}-summary`}>Summary</label>
          <textarea id={`${prefix}-summary`} name="summary" rows={3} defaultValue={project?.summary ?? ""} />
        </div>
        <div className="form-field">
          <label htmlFor={`${prefix}-description`}>Description</label>
          <textarea id={`${prefix}-description`} name="description" rows={5} defaultValue={project?.description ?? ""} />
        </div>
        <div className="form-field">
          <label htmlFor={`${prefix}-status`}>Status</label>
          <select id={`${prefix}-status`} name="status" defaultValue={project?.status ?? "draft"}>
            <option value="draft">Draft (hidden from site)</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor={`${prefix}-order`}>Sort order (lower numbers first)</label>
          <input id={`${prefix}-order`} name="sortOrder" type="number" step="1" required defaultValue={project?.sortOrder ?? 0} />
        </div>
        <label className="admin-checkbox"><input name="featured" type="checkbox" defaultChecked={project?.featured} /> Feature on homepage (up to four published projects)</label>
        {state.error && <p className="admin-error" role="alert">{state.error}</p>}
        {state.success && <p role="status">{state.success}</p>}
        <button className="admin-button" disabled={pending || deleting || uploading}>{pending ? "Saving…" : project ? "Save changes" : "Create project"}</button>
      </form>
      {project && (
        <form action={remove} className="admin-delete-form">
          <input type="hidden" name="id" value={project.id} />
          <label className="admin-checkbox"><input type="checkbox" name="confirmDelete" required /> Permanently delete this project</label>
          <button className="admin-button" disabled={pending || deleting || uploading}>{deleting ? "Deleting…" : "Delete project"}</button>
          {deleteState.error && <p className="admin-error" role="alert">{deleteState.error}</p>}
        </form>
      )}
    </div>
  );
}
