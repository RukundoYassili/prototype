import { FormEvent, useCallback, useEffect, useState } from "react";
import "./media-dashboard.css";

type User = { id: string; username: string; role: "admin" | "staff"; disabled?: number };
type Photo = { id: string; title: string; alt: string; caption: string; published: boolean };
type Gallery = { id: string; title: string };

export default function MediaDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [csrf, setCsrf] = useState("");
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [gallery, setGallery] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [busy, setBusy] = useState(false);
  const api = useCallback(async (path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    if (csrf) headers.set("X-CSRF-Token", csrf);
    const response = await fetch(`/api/media${path}`, { ...init, headers, credentials: "same-origin" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || "The request could not be completed.");
    return body;
  }, [csrf]);
  useEffect(() => {
    api("/session").then(data => { setUser(data.user); setCsrf(data.csrf); }).catch(() => {}).finally(() => setChecking(false));
  }, []);
  useEffect(() => {
    if (!user) return;
    api("/manage/galleries").then(data => { setGalleries(data.galleries); setGallery(data.galleries[0]?.id || ""); }).catch(error => setMessage(error.message));
    if (user.role === "admin") api("/manage/users").then(data => setUsers(data.users)).catch(error => setMessage(error.message));
  }, [user, api]);
  const refresh = useCallback(async () => { if (gallery) setPhotos((await api(`/manage/galleries/${gallery}`)).photos); }, [api, gallery]);
  useEffect(() => { refresh().catch(error => setMessage(error.message)); }, [refresh]);
  async function run(action: () => Promise<void>) { setBusy(true); setMessage(""); try { await action(); } catch (error) { setMessage(error instanceof Error ? error.message : "Something went wrong."); } finally { setBusy(false); } }
  const json = (method: string, data: object): RequestInit => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const field = (form: HTMLFormElement, name: string) => String(new FormData(form).get(name) || "");
  if (checking) return <div className="media-admin"><p role="status">Checking your session…</p></div>;
  if (!user) return <div className="media-admin"><h1>Staff media library</h1><p>Sign in to manage outreach photos.</p>{message && <p role="alert">{message}</p>}<form onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = event.currentTarget; void run(async () => { const data = await api("/login", json("POST", { username: field(form,"username"), password: field(form,"password") })); setUser(data.user); setCsrf(data.csrf); form.reset(); }); }}><label>Username<input name="username" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><button disabled={busy}>Sign in</button></form></div>;
  return <div className="media-admin"><div className="media-admin-heading"><div><p>VUGA NDAKUMVA</p><h1>Staff media library</h1><p>Signed in as {user.username} ({user.role})</p><a href="/staff/content">Go to Content Studio</a></div><button disabled={busy} onClick={() => void run(async () => { await api("/logout", {method:"POST"}); setUser(null); setCsrf(""); setPhotos([]); })}>Sign out</button></div>
    {message && <p role="status" className="media-notice">{message}</p>}
    <section><h2>Outreach gallery</h2><label>Choose gallery<select value={gallery} onChange={e => setGallery(e.target.value)}>{galleries.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}</select></label>
      <form encType="multipart/form-data" onSubmit={event => { event.preventDefault(); const form=event.currentTarget; const body=new FormData(form); void run(async () => { await api(`/manage/galleries/${gallery}/photos`, {method:"POST",body}); form.reset(); await refresh(); setMessage("Photo uploaded as a draft. Publish it when ready."); }); }}><h3>Add a photo</h3><p>JPEG, PNG or WebP, up to 15 MB. Only publish photographs with permission.</p><label>Image<input type="file" name="image" accept="image/jpeg,image/png,image/webp" required /></label><label>Title<input name="title" maxLength={160} required /></label><label>Alternative text<input name="alt" maxLength={300} required /></label><button disabled={busy || !gallery}>Upload draft</button></form>
      <h3>Photos</h3><p>New photos remain private until published. Changes appear on the site after saving.</p><div className="media-photo-list">{photos.map((photo,index) => <PhotoEditor key={photo.id} photo={photo} index={index} total={photos.length} busy={busy} save={(values) => run(async () => { await api(`/manage/photos/${photo.id}`,json("PATCH",values)); await refresh(); setMessage("Photo updated."); })} move={(step) => run(async () => { const ids=photos.map(p=>p.id); const target=index+step; [ids[index],ids[target]]=[ids[target],ids[index]]; await api(`/manage/galleries/${gallery}/order`,json("PUT",{ids})); await refresh(); })} />)}</div></section>
    <section><h2>Change your password</h2><form onSubmit={event => { event.preventDefault(); const form=event.currentTarget; void run(async () => { await api("/password",json("POST",{currentPassword:field(form,"current"),newPassword:field(form,"next")})); setUser(null); setCsrf(""); setMessage("Password changed. Please sign in again."); }); }}><label>Current password<input name="current" type="password" autoComplete="current-password" required /></label><label>New password (at least 12 characters)<input name="next" type="password" minLength={12} maxLength={256} autoComplete="new-password" required /></label><button disabled={busy}>Change password</button></form></section>
    {user.role === "admin" && <section id="staff-accounts"><h2>Staff accounts</h2><form onSubmit={event => { event.preventDefault(); const form=event.currentTarget; void run(async () => { await api("/manage/users",json("POST",{username:field(form,"username"),password:field(form,"password"),role:field(form,"role")})); form.reset(); setUsers((await api("/manage/users")).users); setMessage("Account created. Share its initial password securely and ask the staff member to change it."); }); }}><label>Username<input name="username" pattern="[A-Za-z0-9._-]{3,40}" required /></label><label>Initial password<input name="password" type="password" minLength={12} maxLength={256} autoComplete="new-password" required /></label><label>Role<select name="role"><option value="staff">Staff</option><option value="admin">Administrator</option></select></label><button disabled={busy}>Create account</button></form><ul>{users.map(item => <li key={item.id}>{item.username} — {item.role} {item.disabled ? "(disabled)" : ""} {item.id !== user.id && <button type="button" disabled={busy} onClick={() => void run(async () => { await api(`/manage/users/${item.id}`,json("PATCH",{disabled:!item.disabled})); setUsers((await api("/manage/users")).users); })}>{item.disabled ? "Enable" : "Disable"}</button>}</li>)}</ul></section>}
  </div>;
}

function PhotoEditor({ photo, index, total, busy, save, move }: { photo: Photo; index: number; total: number; busy: boolean; save: (values: {title:string;alt:string;caption:string;published:boolean}) => void; move: (step: number) => void }) {
  const [title,setTitle]=useState(photo.title); const [alt,setAlt]=useState(photo.alt); const [caption,setCaption]=useState(photo.caption || ""); const [published,setPublished]=useState(photo.published);
  useEffect(() => { setTitle(photo.title); setAlt(photo.alt); setCaption(photo.caption || ""); setPublished(photo.published); },[photo]);
  return <form className="media-photo" onSubmit={event => { event.preventDefault(); save({title,alt,caption,published}); }}><img src={`/api/media/manage/images/${photo.id}/thumb`} alt="" loading="lazy" /><div><label>Title<input value={title} onChange={e=>setTitle(e.target.value)} maxLength={160} required /></label><label>Alternative text<input value={alt} onChange={e=>setAlt(e.target.value)} maxLength={300} required /></label><label>Caption (optional)<input value={caption} onChange={e=>setCaption(e.target.value)} maxLength={500} /></label><label className="media-check"><input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)} /> Published</label><div className="media-actions"><button disabled={busy}>Save</button><button type="button" disabled={busy || index===0} onClick={()=>move(-1)}>Move up</button><button type="button" disabled={busy || index===total-1} onClick={()=>move(1)}>Move down</button></div></div></form>;
}
