"use client";

import { useActionState, useId } from "react";
import type { Project } from "@/db/schema";
import { deleteProject, saveProject } from "./actions";

export default function ProjectEditor({ project }: { project?: Project }) {
  const prefix = useId();
  const [state, action, pending] = useActionState(saveProject, {});
  const [deleteState, remove, deleting] = useActionState(deleteProject, {});
  const fields = [
    { name: "title", label: "Title", value: project?.title, required: true },
    { name: "slug", label: "Slug (lowercase, separated by hyphens)", value: project?.slug, required: true },
    { name: "techTags", label: "Technologies (comma separated)", value: project?.techTags.join(", ") },
    { name: "coverImageUrl", label: "Cover image URL (Vercel Blob or GitHub avatar)", value: project?.coverImageUrl, type: "url" },
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
        <button className="admin-button" disabled={pending || deleting}>{pending ? "Saving…" : project ? "Save changes" : "Create project"}</button>
      </form>
      {project && (
        <form action={remove} className="admin-delete-form">
          <input type="hidden" name="id" value={project.id} />
          <label className="admin-checkbox"><input type="checkbox" name="confirmDelete" required /> Permanently delete this project</label>
          <button className="admin-button" disabled={pending || deleting}>{deleting ? "Deleting…" : "Delete project"}</button>
          {deleteState.error && <p className="admin-error" role="alert">{deleteState.error}</p>}
        </form>
      )}
    </div>
  );
}
