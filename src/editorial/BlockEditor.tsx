import { useEffect, useState } from "react";

export type ContentBlock = {
  id: string;
  type: string;
  text?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  question?: string;
  answer?: string;
  label?: string;
  url?: string;
  mediaId?: string;
  alt?: string;
  caption?: string;
};
type Gallery = { id: string; title: string };
type Photo = { id: string; title: string; alt: string; published: boolean };
type Api = (path: string, init?: RequestInit) => Promise<any>;
const labels: Record<string, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  list: "List",
  quote: "Quotation",
  notice: "Safety notice",
  table: "Table",
  question: "Question and answer",
  link: "Link",
  download: "Download link",
  image: "Image",
};
function createBlock(type: string): ContentBlock {
  const id = crypto.randomUUID();
  if (["heading", "paragraph", "quote", "notice"].includes(type))
    return { id, type, text: "" };
  if (type === "list") return { id, type, items: [""] };
  if (type === "table")
    return { id, type, headers: ["", ""], rows: [["", ""]] };
  if (type === "question") return { id, type, question: "", answer: "" };
  if (type === "link" || type === "download")
    return { id, type, label: "", url: "" };
  return { id, type, mediaId: "", alt: "", caption: "" };
}

export function BlockEditor({
  blocks,
  onChange,
  readOnly,
  api,
}: {
  blocks: ContentBlock[];
  onChange: (value: ContentBlock[]) => void;
  readOnly: boolean;
  api: Api;
}) {
  const [kind, setKind] = useState("paragraph");
  const change = (index: number, patch: Partial<ContentBlock>) =>
    onChange(
      blocks.map((block, i) => (i === index ? { ...block, ...patch } : block)),
    );
  const move = (index: number, step: number) => {
    const next = [...blocks];
    [next[index], next[index + step]] = [next[index + step], next[index]];
    onChange(next);
  };
  return (
    <section
      className="studio-block-editor studio-full-field"
      aria-labelledby="blocks-heading"
    >
      <div className="studio-section-heading">
        <div>
          <h3 id="blocks-heading">Content blocks</h3>
          <p>
            Build the body with sections, references and media. Blocks can be
            reordered.
          </p>
        </div>
      </div>
      {blocks.map((block, index) => (
        <article className="studio-block" key={block.id}>
          <div className="studio-block-top">
            <strong>
              {index + 1}. {labels[block.type]}
            </strong>
            {!readOnly && (
              <div>
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${labels[block.type]} ${index + 1} up`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === blocks.length - 1}
                  aria-label={`Move ${labels[block.type]} ${index + 1} down`}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onChange(blocks.filter((_, i) => i !== index))}
                  aria-label={`Remove ${labels[block.type]} ${index + 1}`}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          {["heading", "paragraph", "quote", "notice"].includes(block.type) && (
            <label>
              {labels[block.type]} text
              <textarea
                value={block.text || ""}
                maxLength={5000}
                readOnly={readOnly}
                onChange={(e) => change(index, { text: e.target.value })}
              />
            </label>
          )}
          {block.type === "list" && (
            <label>
              List items, one per line
              <textarea
                value={(block.items || []).join("\n")}
                readOnly={readOnly}
                onChange={(e) =>
                  change(index, { items: e.target.value.split("\n") })
                }
              />
            </label>
          )}
          {block.type === "question" && (
            <div className="studio-block-fields">
              <label>
                Question
                <textarea
                  value={block.question || ""}
                  maxLength={2000}
                  readOnly={readOnly}
                  onChange={(e) => change(index, { question: e.target.value })}
                />
              </label>
              <label>
                Answer
                <textarea
                  value={block.answer || ""}
                  maxLength={5000}
                  readOnly={readOnly}
                  onChange={(e) => change(index, { answer: e.target.value })}
                />
              </label>
            </div>
          )}
          {(block.type === "link" || block.type === "download") && (
            <div className="studio-block-fields">
              <label>
                Link label
                <input
                  value={block.label || ""}
                  maxLength={300}
                  readOnly={readOnly}
                  onChange={(e) => change(index, { label: e.target.value })}
                />
              </label>
              <label>
                Link address
                <input
                  value={block.url || ""}
                  placeholder="https:// or /path"
                  maxLength={2000}
                  readOnly={readOnly}
                  onChange={(e) => change(index, { url: e.target.value })}
                />
              </label>
            </div>
          )}
          {block.type === "image" && (
            <ImagePicker
              block={block}
              onChange={(patch) => change(index, patch)}
              readOnly={readOnly}
              api={api}
            />
          )}
          {block.type === "table" && (
            <TableEditor
              block={block}
              onChange={(patch) => change(index, patch)}
              readOnly={readOnly}
            />
          )}
        </article>
      ))}
      {!readOnly && (
        <div className="studio-add-block">
          <label>
            Block type
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              {Object.entries(labels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="studio-secondary"
            disabled={blocks.length >= 100}
            onClick={() => onChange([...blocks, createBlock(kind)])}
          >
            Add block
          </button>
        </div>
      )}
    </section>
  );
}

function TableEditor({
  block,
  onChange,
  readOnly,
}: {
  block: ContentBlock;
  onChange: (patch: Partial<ContentBlock>) => void;
  readOnly: boolean;
}) {
  const headers = block.headers || [];
  const rows = block.rows || [];
  const setHeader = (i: number, value: string) =>
    onChange({ headers: headers.map((cell, j) => (j === i ? value : cell)) });
  const setCell = (i: number, j: number, value: string) =>
    onChange({
      rows: rows.map((row, r) =>
        r === i ? row.map((cell, c) => (c === j ? value : cell)) : row,
      ),
    });
  return (
    <div className="studio-table-editor">
      <p>
        Enter column headings and cells. Use the controls to add or remove rows
        and columns. On a small screen, scroll the table sideways to see all
        columns.
      </p>
      <div
        className="studio-table-scroll"
        tabIndex={0}
        role="region"
        aria-label="Editable table; scroll sideways for more columns"
      >
        <table>
          <thead>
            <tr>
              {headers.map((value, i) => (
                <th key={i}>
                  <label>
                    <span className="studio-sr-only">
                      Column {i + 1} heading
                    </span>
                    <input
                      value={value}
                      maxLength={500}
                      readOnly={readOnly}
                      onChange={(e) => setHeader(i, e.target.value)}
                    />
                  </label>
                  {!readOnly && headers.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          headers: headers.filter((_, j) => j !== i),
                          rows: rows.map((row) =>
                            row.filter((_, j) => j !== i),
                          ),
                        })
                      }
                      aria-label={`Remove column ${i + 1}`}
                    >
                      ×
                    </button>
                  )}
                </th>
              ))}
              {!readOnly && <th>Row</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((value, j) => (
                  <td key={j}>
                    <label>
                      <span className="studio-sr-only">
                        Row {i + 1}, column {j + 1}
                      </span>
                      <input
                        value={value}
                        maxLength={500}
                        readOnly={readOnly}
                        onChange={(e) => setCell(i, j, e.target.value)}
                      />
                    </label>
                  </td>
                ))}
                {!readOnly && (
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        onChange({ rows: rows.filter((_, j) => j !== i) })
                      }
                      aria-label={`Remove row ${i + 1}`}
                    >
                      ×
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!readOnly && (
        <div className="studio-table-actions">
          <button
            type="button"
            disabled={headers.length >= 12}
            onClick={() =>
              onChange({
                headers: [...headers, ""],
                rows: rows.map((row) => [...row, ""]),
              })
            }
          >
            Add column
          </button>
          <button
            type="button"
            disabled={rows.length >= 50}
            onClick={() => onChange({ rows: [...rows, headers.map(() => "")] })}
          >
            Add row
          </button>
        </div>
      )}
    </div>
  );
}

function ImagePicker({
  block,
  onChange,
  readOnly,
  api,
}: {
  block: ContentBlock;
  onChange: (patch: Partial<ContentBlock>) => void;
  readOnly: boolean;
  api: Api;
}) {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [gallery, setGallery] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let current = true;
    api("/manage/galleries")
      .then((data) => {
        if (current) {
          setGalleries(data.galleries);
          setGallery(data.galleries[0]?.id || "");
        }
      })
      .catch(() => {
        if (current) setError("The media library is unavailable.");
      });
    return () => {
      current = false;
    };
  }, [api]);
  useEffect(() => {
    let current = true;
    setPhotos([]);
    if (gallery)
      api(`/manage/galleries/${encodeURIComponent(gallery)}`)
        .then((data) => {
          if (current) {
            setPhotos(data.photos);
            setError("");
          }
        })
        .catch(() => {
          if (current) setError("The gallery could not be loaded.");
        });
    return () => {
      current = false;
    };
  }, [api, gallery]);
  return (
    <div className="studio-block-fields">
      {error && <p role="status">{error}</p>}
      <label>
        Gallery
        <select
          value={gallery}
          disabled={readOnly}
          onChange={(e) => setGallery(e.target.value)}
        >
          {galleries.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        Photo
        <select
          value={block.mediaId || ""}
          disabled={readOnly}
          onChange={(e) => {
            const photo = photos.find((item) => item.id === e.target.value);
            onChange({
              mediaId: e.target.value,
              alt: block.alt || photo?.alt || "",
            });
          }}
        >
          <option value="">Choose a photo</option>
          {block.mediaId &&
            !photos.some((photo) => photo.id === block.mediaId) && (
              <option value={block.mediaId}>Selected photo</option>
            )}
          {photos.map((photo) => (
            <option key={photo.id} value={photo.id}>
              {photo.title}
              {photo.published ? "" : " (unpublished)"}
            </option>
          ))}
        </select>
      </label>
      {block.mediaId && (
        <img
          className="studio-block-image"
          src={`/api/media/manage/images/${block.mediaId}/thumb`}
          alt=""
        />
      )}
      <label>
        Alternative text
        <input
          value={block.alt || ""}
          maxLength={300}
          readOnly={readOnly}
          onChange={(e) => onChange({ alt: e.target.value })}
        />
      </label>
      <label>
        Caption
        <input
          value={block.caption || ""}
          maxLength={500}
          readOnly={readOnly}
          onChange={(e) => onChange({ caption: e.target.value })}
        />
      </label>
      <p>
        Only use photos with permission. Publication status is managed in the
        media library.
      </p>
    </div>
  );
}
