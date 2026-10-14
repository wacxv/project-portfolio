<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Ignore routine debugging and unverified changes. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Keep a qualifying candidate through the reporting pass even if you resolve or work around it. A successful fix changes the report outcome; it does not erase the friction that qualified it.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `node node_modules/next/dist/bin/next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->

## Project rules

Project: personal portfolio for Joaquin Vizconde (GitHub: wacxv), built with Next.js App Router and TypeScript, deployed on Vercel.

Rules for every task:
- Styling: plain CSS with ids and classes in the global stylesheet. No Tailwind, no CSS-in-JS.
- Theme: dark background (#0a0c14), red accent #DC2626 (lighter #F87171 for small text highlights), white/gray text. Define colors, spacing, radii and durations as CSS variables on :root and reuse them.
- Animation: framer-motion, reusing the existing fadeInUp and staggerContainer variants. Only animate opacity and transform.
- Server components by default. Add "use client" only where interactivity is needed.
- TypeScript strict. No `any`. Define and reuse types.
- Accessibility: semantic HTML, visible focus states, AA contrast, alt text, aria labels on icon-only controls.
- Secrets only in environment variables, never NEXT_PUBLIC_ unless intentionally public.
- Framework version: this project appears to be on Next.js 16 (check package.json). Before using any Next.js API, read AGENTS.md and the docs it points to, and do not assume older conventions. Things that changed in recent versions: the middleware file is now called proxy.ts, revalidateTag takes a cache-life profile as a second argument, and params / searchParams / cookies() / headers() are async.
- Existing files to keep: components/Header.tsx (my navbar), components/SmoothScroll.tsx, lib/github.ts, neon.ts (my database connection test), and the photos in public/gallery.
- Do not modify files unrelated to the task. Do not refactor working code.
- After every task: show the diff, list any placeholders I must fill in, and list how to test it.