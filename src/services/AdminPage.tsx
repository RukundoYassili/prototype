import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus, Settings2 } from "lucide-react";
import { Button, Checkbox, Input, Modal, Select } from "../system/components";
import { useDemo, formatSlot } from "./DemoContext";
import {
  categoryLabel,
  languages,
  type Category,
  type DemoBooking,
  type Language,
  type Professional,
  type Service,
  type SessionFormat,
} from "./data";
import { DemoNote, PageHeading } from "./Shared";

type Editor = { type: "service" | "professional" | "slot"; id?: string };
export default function AdminPage() {
  const demo = useDemo();
  const [tab, setTab] = useState("Services"),
    [editor, setEditor] = useState<Editor | null>(null),
    [notice, setNotice] = useState(""),
    [slotService, setSlotService] = useState("all");
  return (
    <div className="svc-content svc-admin">
      <PageHeading
        eyebrow="ADMINISTRATION · PUBLIC DEMONSTRATION"
        title="A thoughtful view behind the scenes."
        description="Explore how services, people, and sessions could be managed."
      />
      <DemoNote>
        This is a public sample administration view, not a secure admin system.
        No login is required because all records are fictional and changes stay
        in memory. Never enter real client information.
      </DemoNote>
      <div className="svc-admin-stat-row">
        {[
          [demo.services.length, "Services"],
          [demo.professionals.length, "Sample profiles"],
          [demo.bookings.length, "Demo bookings"],
          [
            demo.enquiries.filter((e) => e.status === "New").length,
            "Open enquiries",
          ],
        ].map(([n, t]) => (
          <div key={t}>
            <strong>{n}</strong>
            <span>{t}</span>
          </div>
        ))}
      </div>
      <div className="svc-admin-toolbar">
        <div
          className="svc-category-tabs"
          role="group"
          aria-label="Administration views"
        >
          {[
            "Services",
            "Professionals",
            "Schedules",
            "Bookings",
            "Enquiries",
          ].map((t) => (
            <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        {["Services", "Professionals", "Schedules"].includes(tab) && (
          <Button
            onClick={() =>
              setEditor({
                type:
                  tab === "Services"
                    ? "service"
                    : tab === "Professionals"
                      ? "professional"
                      : "slot",
              })
            }
          >
            <Plus size={16} />
            {tab === "Schedules"
              ? "Add demo time"
              : tab === "Services"
                ? "Add service"
                : "Add profile"}
          </Button>
        )}
      </div>
      {notice && (
        <p role="status" className="svc-notice">
          {notice}
        </p>
      )}
      <div className="svc-admin-table-wrap">
        {tab === "Services" ? (
          <table className="svc-admin-table">
            <caption>Sample service management</caption>
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">Category</th>
                <th scope="col">Example price</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {demo.services.map((s) => (
                <tr key={s.id}>
                  <th scope="row">
                    <Link to={`/services/${s.id}`}>{s.title} ↗</Link>
                    <small>
                      {s.duration} minutes · {s.kind}
                    </small>
                  </th>
                  <td>{categoryLabel(s.category)}</td>
                  <td>{demo.price(s)}</td>
                  <td>
                    <span
                      className={`svc-status ${s.active ? "upcoming" : "cancelled"}`}
                    >
                      {s.active ? "Active" : "Paused"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setEditor({ type: "service", id: s.id })}
                      aria-label={`Edit service ${s.title}`}
                    >
                      Edit
                    </button>
                    <button
                      aria-label={`${s.active ? "Pause" : "Activate"} service ${s.title}`}
                      onClick={() => {
                        demo.setServices((v) =>
                          v.map((item) =>
                            item.id === s.id
                              ? { ...item, active: !item.active }
                              : item,
                          ),
                        );
                        setNotice("Service status updated in this preview.");
                      }}
                    >
                      {s.active ? "Pause" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : tab === "Professionals" ? (
          <table className="svc-admin-table">
            <caption>
              Fictional professional profiles · credentials are not verified
            </caption>
            <thead>
              <tr>
                <th scope="col">Professional</th>
                <th scope="col">Languages</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {demo.professionals.map((p) => (
                <tr key={p.id}>
                  <th scope="row">
                    <Link to={`/professionals/${p.id}`}>{p.name} ↗</Link>
                    <small>{p.role}</small>
                  </th>
                  <td>{p.languages.join(", ")}</td>
                  <td>{p.active ? "Active" : "Paused"} · demo</td>
                  <td>
                    <button
                      onClick={() =>
                        setEditor({ type: "professional", id: p.id })
                      }
                      aria-label={`Edit profile ${p.name}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        demo.setProfessionals((v) =>
                          v.map((item) =>
                            item.id === p.id
                              ? { ...item, active: !item.active }
                              : item,
                          ),
                        );
                        setNotice("Sample profile status updated.");
                      }}
                    >
                      {p.active ? "Pause" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : tab === "Schedules" ? (
          <>
            <div className="svc-admin-schedule-filter">
              <Select
                label="Filter schedules by service"
                value={slotService}
                onChange={(e) => setSlotService(e.target.value)}
              >
                <option value="all">All services</option>
                {demo.services.map((s) => (
                  <option value={s.id} key={s.id}>
                    {s.title}
                  </option>
                ))}
              </Select>
              <small>
                All times shown in {demo.timezone}. Add-time inputs explicitly
                use UTC.
              </small>
            </div>
            <table className="svc-admin-table">
              <caption>
                Sample availability ·{" "}
                {
                  demo.slots.filter(
                    (s) => slotService === "all" || s.serviceId === slotService,
                  ).length
                }{" "}
                slots
              </caption>
              <thead>
                <tr>
                  <th scope="col">Service & professional</th>
                  <th scope="col">Date and time</th>
                  <th scope="col">Format</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {demo.slots
                  .filter(
                    (s) => slotService === "all" || s.serviceId === slotService,
                  )
                  .map((slot) => {
                    const booked = demo.bookings.some(
                      (b) =>
                        b.status === "Upcoming" &&
                        b.professionalId === slot.professionalId &&
                        b.startsAt === slot.startsAt,
                    );
                    return (
                      <tr key={slot.id}>
                        <th scope="row">
                          {
                            demo.services.find((s) => s.id === slot.serviceId)
                              ?.title
                          }
                          <small>
                            {
                              demo.professionals.find(
                                (p) => p.id === slot.professionalId,
                              )?.name
                            }
                          </small>
                        </th>
                        <td>{formatSlot(slot.startsAt, demo.timezone)}</td>
                        <td>{slot.format}</td>
                        <td>
                          <button
                            disabled={booked}
                            aria-label={`Remove demo time ${slot.id}`}
                            onClick={() => {
                              demo.setSlots((v) =>
                                v.filter((s) => s.id !== slot.id),
                              );
                              setNotice("Demo availability removed.");
                            }}
                          >
                            {booked ? "Booked in demo" : "Remove"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </>
        ) : tab === "Bookings" ? (
          <table className="svc-admin-table">
            <caption>
              Demo appointments · no real contact details are stored
            </caption>
            <thead>
              <tr>
                <th scope="col">Appointment</th>
                <th scope="col">Session time</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {demo.bookings.map((b) => (
                <tr key={b.id}>
                  <th scope="row">
                    {demo.services.find((s) => s.id === b.serviceId)?.title}
                    <small>
                      {
                        demo.professionals.find(
                          (p) => p.id === b.professionalId,
                        )?.name
                      }{" "}
                      · {b.format}
                    </small>
                  </th>
                  <td>{formatSlot(b.startsAt, demo.timezone)}</td>
                  <td>
                    <Select
                      label={`Status for ${b.id}`}
                      value={b.status}
                      onChange={(e) => {
                        const status = e.target.value as DemoBooking["status"];
                        demo.setBookings((v) =>
                          v.map((item) =>
                            item.id === b.id ? { ...item, status } : item,
                          ),
                        );
                        setNotice(
                          "Demo appointment status updated. No notification was sent.",
                        );
                      }}
                    >
                      {["Upcoming", "Completed", "Cancelled"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="svc-admin-table">
            <caption>
              Sample enquiries · topics only, no private messages or contact
              details
            </caption>
            <thead>
              <tr>
                <th scope="col">Topic</th>
                <th scope="col">Service</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {demo.enquiries.map((e) => (
                <tr key={e.id}>
                  <th scope="row">{e.subject}</th>
                  <td>
                    {demo.services.find((s) => s.id === e.serviceId)?.title}
                  </td>
                  <td>
                    <span className="svc-status">{e.status}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        demo.setEnquiries((v) =>
                          v.map((item) =>
                            item.id === e.id
                              ? {
                                  ...item,
                                  status:
                                    item.status === "New" ? "Resolved" : "New",
                                }
                              : item,
                          ),
                        );
                        setNotice(
                          "Enquiry status updated locally. No reply was sent.",
                        );
                      }}
                    >
                      {e.status === "New" ? "Mark resolved" : "Reopen"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {editor && (
        <AdminEditor
          key={`${editor.type}-${editor.id || "new"}`}
          editor={editor}
          close={() => setEditor(null)}
          saved={() => {
            setEditor(null);
            setNotice(
              "Sample record saved. Changes reset when the page is refreshed.",
            );
          }}
        />
      )}
    </div>
  );
}

function AdminEditor({
  editor,
  close,
  saved,
}: {
  editor: Editor;
  close: () => void;
  saved: () => void;
}) {
  const demo = useDemo(),
    service = demo.services.find((s) => s.id === editor.id),
    profile = demo.professionals.find((p) => p.id === editor.id);
  const [title, setTitle] = useState(
      editor.type === "professional"
        ? profile?.name || ""
        : service?.title || "",
    ),
    [description, setDescription] = useState(
      editor.type === "professional"
        ? profile?.bio || ""
        : service?.description || "",
    ),
    [role, setRole] = useState(profile?.role || ""),
    [specialties, setSpecialties] = useState(
      profile?.specialties.join(", ") || "",
    ),
    [category, setCategory] = useState<Category>(
      service?.category || "wellness",
    ),
    [kind, setKind] = useState<Service["kind"]>(service?.kind || "Session"),
    [duration, setDuration] = useState(service?.duration || 45),
    [free, setFree] = useState(service ? service.priceRwf === 0 : false),
    [rwf, setRwf] = useState(service?.priceRwf || 15000),
    [usd, setUsd] = useState(service?.priceUsd || 20),
    [selectedLanguages, setSelectedLanguages] = useState<Language[]>(
      profile?.languages || service?.languages || ["English"],
    ),
    [formats, setFormats] = useState<SessionFormat[]>(
      profile?.formats || service?.formats || ["Online"],
    ),
    [providerIds, setProviderIds] = useState(
      service?.professionalIds || [demo.professionals[0].id],
    ),
    [scheduleService, setScheduleService] = useState(
      demo.services.find((s) => s.active)?.id || "",
    ),
    [scheduleProvider, setScheduleProvider] = useState(""),
    [scheduleFormat, setScheduleFormat] = useState<SessionFormat>("Online"),
    [date, setDate] = useState(""),
    [time, setTime] = useState(""),
    [error, setError] = useState("");
  const chosenService = demo.services.find((s) => s.id === scheduleService);
  const activeProviderIds =
    chosenService?.professionalIds.filter(
      (id) => demo.professionals.find((p) => p.id === id)?.active,
    ) || [];
  const currentProvider = activeProviderIds.includes(scheduleProvider)
    ? scheduleProvider
    : activeProviderIds[0] || "";
  const currentFormat = chosenService?.formats.includes(scheduleFormat)
    ? scheduleFormat
    : chosenService?.formats[0] || "Online";
  function submit() {
    setError("");
    if (editor.type === "slot") {
      const iso = new Date(`${date}T${time}:00Z`).toISOString();
      if (Date.parse(iso) <= Date.now()) {
        setError("Choose a future date and time in UTC.");
        return;
      }
      const durationMs = (chosenService?.duration || 60) * 60000;
      if (
        demo.slots.some(
          (s) =>
            s.professionalId === currentProvider &&
            Date.parse(s.startsAt) < Date.parse(iso) + durationMs &&
            Date.parse(s.startsAt) +
              (demo.services.find((v) => v.id === s.serviceId)?.duration ||
                60) *
                60000 >
              Date.parse(iso),
        )
      ) {
        setError(
          "That professional already has overlapping demo availability. Choose another time.",
        );
        return;
      }
      demo.setSlots((v) => [
        ...v,
        {
          id: crypto.randomUUID(),
          serviceId: scheduleService,
          professionalId: currentProvider,
          format: currentFormat,
          startsAt: iso,
        },
      ]);
      saved();
      return;
    }
    if (
      !selectedLanguages.length ||
      !formats.length ||
      (editor.type === "service" && !providerIds.length)
    ) {
      setError(
        "Choose at least one language, format, and professional where applicable.",
      );
      return;
    }
    const id =
      editor.id ||
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    if (!id) {
      setError("Use a name containing letters or numbers.");
      return;
    }
    if (
      !editor.id &&
      (editor.type === "service" ? demo.services : demo.professionals).some(
        (item) => item.id === id,
      )
    ) {
      setError("A sample record with that name already exists.");
      return;
    }
    if (editor.type === "professional") {
      const value: Professional = {
        id,
        name: title.trim(),
        role: role.trim(),
        bio: description.trim(),
        specialties: specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        image: profile?.image || "professional",
        languages: selectedLanguages,
        formats,
        active: profile?.active ?? true,
      };
      demo.setProfessionals((v) =>
        profile ? v.map((p) => (p.id === id ? value : p)) : [...v, value],
      );
    } else {
      const value: Service = {
        id,
        title: title.trim(),
        description: description.trim(),
        category,
        kind,
        duration,
        priceRwf: free ? 0 : rwf,
        priceUsd: free ? 0 : usd,
        languages: selectedLanguages,
        formats,
        professionalIds: providerIds,
        image:
          service?.image ||
          (category === "wellness" ? "environment" : "kindness"),
        audience:
          service?.audience ||
          "Adults exploring routine support options in this demonstration.",
        benefits: service?.benefits || [
          "Explore your preferences",
          "Ask questions about the format",
          "Consider a practical next step",
        ],
        tags: service?.tags || ["Build a routine"],
        active: service?.active ?? true,
      };
      demo.setServices((v) =>
        service ? v.map((s) => (s.id === id ? value : s)) : [...v, value],
      );
    }
    saved();
  }
  return (
    <Modal
      open
      onClose={close}
      title={
        editor.type === "slot"
          ? "Add a demo session time"
          : `${editor.id ? "Edit" : "Add"} ${editor.type === "service" ? "sample service" : "fictional profile"}`
      }
    >
      <form
        className="svc-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <DemoNote>
          Sample data only. No real services, credentials, or availability are
          created.
        </DemoNote>
        {error && (
          <p role="alert" className="svc-error">
            {error}
          </p>
        )}
        {editor.type === "slot" ? (
          <>
            <Select
              label="Service"
              value={scheduleService}
              onChange={(e) => {
                setScheduleService(e.target.value);
                setScheduleProvider("");
              }}
              required
            >
              {demo.services
                .filter((s) => s.active)
                .map((s) => (
                  <option value={s.id} key={s.id}>
                    {s.title}
                  </option>
                ))}
            </Select>
            <Select
              label="Professional"
              value={currentProvider}
              onChange={(e) => setScheduleProvider(e.target.value)}
              required
            >
              {chosenService?.professionalIds
                .filter(
                  (id) => demo.professionals.find((p) => p.id === id)?.active,
                )
                .map((id) => (
                  <option key={id} value={id}>
                    {demo.professionals.find((p) => p.id === id)?.name}
                  </option>
                ))}
            </Select>
            <Select
              label="Format"
              value={currentFormat}
              onChange={(e) =>
                setScheduleFormat(e.target.value as SessionFormat)
              }
            >
              {chosenService?.formats.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </Select>
            <div className="svc-form-columns">
              <Input
                label="Session date (UTC)"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <Input
                label="Session time (UTC)"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <small>
              Schedule entries use UTC explicitly. Public pages display the same
              appointment instant in the selected visitor time zone.
            </small>
          </>
        ) : (
          <>
            <Input
              label={
                editor.type === "professional"
                  ? "Profile name"
                  : "Service title"
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={80}
              minLength={2}
            />
            <label className="svc-textarea-label">
              {editor.type === "professional"
                ? "Sample biography"
                : "Service description"}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={600}
                rows={3}
              />
            </label>
            {editor.type === "professional" ? (
              <>
                <Input
                  label="Sample role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
                <Input
                  label="Specialties, separated by commas"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  required
                />
                <p className="svc-small">
                  Credentials remain explicitly unverified. Do not enter actual
                  registration or client information.
                </p>
              </>
            ) : (
              <>
                <div className="svc-form-columns">
                  <Select
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                  >
                    <option value="wellness">Wellness</option>
                    <option value="mental-health">Mental health support</option>
                  </Select>
                  <Select
                    label="Service kind"
                    value={kind}
                    onChange={(e) => setKind(e.target.value as Service["kind"])}
                  >
                    {["Session", "Group", "Plan"].map((k) => (
                      <option key={k}>{k}</option>
                    ))}
                  </Select>
                </div>
                <Input
                  label="Duration in minutes"
                  type="number"
                  min={10}
                  max={180}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  required
                />
                <Checkbox
                  label="Free service"
                  checked={free}
                  onChange={(e) => setFree(e.target.checked)}
                />
                {!free && (
                  <div className="svc-form-columns">
                    <Input
                      label="Example price (RWF)"
                      type="number"
                      min={1}
                      step={1}
                      value={rwf}
                      onChange={(e) => setRwf(Number(e.target.value))}
                      required
                    />
                    <Input
                      label="Example price (USD)"
                      type="number"
                      min={1}
                      step={1}
                      value={usd}
                      onChange={(e) => setUsd(Number(e.target.value))}
                      required
                    />
                  </div>
                )}
                <fieldset>
                  <legend>Sample professionals</legend>
                  {demo.professionals
                    .filter((p) => p.active)
                    .map((p) => (
                      <Checkbox
                        key={p.id}
                        label={p.name}
                        checked={providerIds.includes(p.id)}
                        onChange={() =>
                          setProviderIds((v) =>
                            v.includes(p.id)
                              ? v.filter((id) => id !== p.id)
                              : [...v, p.id],
                          )
                        }
                      />
                    ))}
                </fieldset>
              </>
            )}
            <fieldset>
              <legend>Languages</legend>
              {languages.map((l) => (
                <Checkbox
                  key={l}
                  label={l}
                  checked={selectedLanguages.includes(l)}
                  onChange={() =>
                    setSelectedLanguages((v) =>
                      v.includes(l) ? v.filter((x) => x !== l) : [...v, l],
                    )
                  }
                />
              ))}
            </fieldset>
            <fieldset>
              <legend>Session formats</legend>
              {(["Online", "In person"] as SessionFormat[]).map((f) => (
                <Checkbox
                  key={f}
                  label={f}
                  checked={formats.includes(f)}
                  onChange={() =>
                    setFormats((v) =>
                      v.includes(f) ? v.filter((x) => x !== f) : [...v, f],
                    )
                  }
                />
              ))}
            </fieldset>
          </>
        )}
        <Button type="submit">Save sample record</Button>
        <Button variant="secondary" onClick={close} type="button">
          Cancel
        </Button>
      </form>
    </Modal>
  );
}
