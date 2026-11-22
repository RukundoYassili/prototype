import { useEffect, useRef, useState } from "react";
import type { ContentBlock } from "./BlockEditor";

type Draft = {
  title: string;
  summary: string;
  body?: string;
  blocks?: ContentBlock[];
  type: string;
  language: string;
};
export function DraftPreview({
  draft,
  onClose,
}: {
  draft: Draft;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const node = dialog.current;
    if (node && !node.open) node.showModal();
    return () => {
      if (node?.open) node.close();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="studio-preview-dialog"
      aria-labelledby="preview-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className="studio-preview-toolbar">
        <div>
          <strong id="preview-title">Private draft preview</strong>
          <small>
            Content preview · final website layout is still in development
          </small>
        </div>
        <div>
          <button
            type="button"
            aria-pressed={!mobile}
            onClick={() => setMobile(false)}
          >
            Desktop
          </button>
          <button
            type="button"
            aria-pressed={mobile}
            onClick={() => setMobile(true)}
          >
            Mobile
          </button>
          <button type="button" onClick={onClose}>
            Close preview
          </button>
        </div>
      </header>
      <div className="studio-preview-scroll">
        <article
          className={`studio-preview-paper ${mobile ? "is-mobile" : ""}`}
        >
          <p className="studio-eyebrow">
            {draft.type.toUpperCase()} · {draft.language.toUpperCase()}
          </p>
          <h1>{draft.title}</h1>
          <p className="studio-preview-summary">{draft.summary}</p>
          {draft.body && <p>{draft.body}</p>}
          {(draft.blocks || []).map((block) => (
            <PreviewBlock key={block.id} block={block} />
          ))}
        </article>
      </div>
    </dialog>
  );
}
function PreviewBlock({ block }: { block: ContentBlock }) {
  if (block.type === "heading") return <h2>{block.text}</h2>;
  if (block.type === "paragraph") return <p>{block.text}</p>;
  if (block.type === "quote") return <blockquote>{block.text}</blockquote>;
  if (block.type === "notice")
    return <aside className="studio-preview-notice">{block.text}</aside>;
  if (block.type === "list")
    return (
      <ul>
        {(block.items || []).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  if (block.type === "question")
    return (
      <details>
        <summary>{block.question}</summary>
        <p>{block.answer}</p>
      </details>
    );
  if (block.type === "table")
    return (
      <div
        className="studio-table-scroll"
        tabIndex={0}
        role="region"
        aria-label="Preview table; scroll sideways for more columns"
      >
        <table>
          <thead>
            <tr>
              {(block.headers || []).map((cell, i) => (
                <th scope="col" key={i}>
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(block.rows || []).map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  if (block.type === "image")
    return (
      <figure>
        {block.mediaId && (
          <img
            src={`/api/media/manage/images/${encodeURIComponent(block.mediaId)}/large`}
            alt={block.alt || ""}
          />
        )}{" "}
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    );
  if (block.type === "link" || block.type === "download")
    return safeUrl(block.url) ? (
      <p>
        <a href={block.url} target="_blank" rel="noreferrer">
          {block.label}
        </a>
      </p>
    ) : (
      <p>{block.label}</p>
    );
  return null;
}
function safeUrl(value?: string) {
  if (!value || /\s|\\/.test(value)) return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}
