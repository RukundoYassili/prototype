import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button, Checkbox, Input, Modal, Select } from "../system/components";
import { useDemo, dateKey, formatSlot } from "./DemoContext";
import { DemoNote, LocationNote } from "./Shared";
import type { SessionFormat } from "./data";

export default function BookingDialog() {
  const { request } = useDemo();
  return request ? (
    <BookingFlow
      key={`${request.serviceId}-${request.rescheduleId || "new"}`}
    />
  ) : null;
}
function BookingFlow() {
  const demo = useDemo(),
    navigate = useNavigate();
  const request = demo.request!;
  const service = demo.services.find((s) => s.id === request.serviceId);
  const previous = demo.bookings.find((b) => b.id === request.rescheduleId);
  const activeProviders =
    service?.professionalIds.filter(
      (id) => demo.professionals.find((p) => p.id === id)?.active,
    ) || [];
  const requestedProvider =
    request.professionalId || previous?.professionalId || "";
  const [professional, setProfessional] = useState(
      activeProviders.includes(requestedProvider)
        ? requestedProvider
        : activeProviders[0] || "",
    ),
    [format, setFormat] = useState<SessionFormat>(
      previous && service?.formats.includes(previous.format)
        ? previous.format
        : service?.formats[0] || "Online",
    ),
    [date, setDate] = useState(""),
    [slotId, setSlotId] = useState(""),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [step, setStep] = useState<"details" | "review" | "done">("details"),
    [error, setError] = useState("");
  const choices = service
    ? demo
        .availableSlots(service.id, previous?.id)
        .filter((s) => s.professionalId === professional && s.format === format)
    : [];
  const dates = [
    ...new Set(choices.map((s) => dateKey(s.startsAt, demo.timezone))),
  ];
  const currentDate = dates.includes(date) ? date : dates[0] || "";
  const times = choices.filter(
    (s) => dateKey(s.startsAt, demo.timezone) === currentDate,
  );
  const slot = demo.slots.find((s) => s.id === slotId);
  const provider = demo.professionals.find((p) => p.id === professional);
  const close = () => demo.setRequest(null);
  function confirm() {
    const available = demo
      .availableSlots(request.serviceId, previous?.id)
      .find((s) => s.id === slotId);
    if (!service?.active || !available) {
      setError(
        "That demo time is no longer available. Please choose another session.",
      );
      setStep("details");
      setSlotId("");
      return;
    }
    demo.setBookings((bookings) =>
      previous
        ? bookings.map((b) =>
            b.id === previous.id
              ? {
                  ...b,
                  professionalId: available.professionalId,
                  format: available.format,
                  startsAt: available.startsAt,
                }
              : b,
          )
        : [
            ...bookings,
            {
              id: crypto.randomUUID(),
              serviceId: service.id,
              professionalId: available.professionalId,
              format: available.format,
              startsAt: available.startsAt,
              status: "Upcoming",
              priceRwf: service.priceRwf,
              priceUsd: service.priceUsd,
            },
          ],
    );
    setName("");
    setEmail("");
    setStep("done");
  }
  return (
    <Modal
      open
      focusKey={step}
      onClose={close}
      title={
        step === "done"
          ? "A little space, set aside."
          : previous
            ? "Reschedule demo appointment"
            : "Make room for yourself."
      }
    >
      <ol className="booking-progress" aria-label="Booking progress">
        {[
          ["details", "1. Details"],
          ["review", "2. Review"],
          ["done", "3. Confirmation"],
        ].map(([value, label]) => (
          <li key={value} aria-current={step === value ? "step" : undefined}>
            {label}
          </li>
        ))}
      </ol>
      {!service ? (
        <>
          <p>This service is no longer available.</p>
          <Button onClick={close}>Close</Button>
        </>
      ) : step === "done" ? (
        <div className="svc-form">
          <CheckCircle2 className="svc-success-icon" size={44} />
          <h3>
            {previous
              ? "Demo appointment updated."
              : "Your demo appointment is ready."}
          </h3>
          <p>{service.title}</p>
          {slot && (
            <p className="svc-booking-time">
              {formatSlot(slot.startsAt, demo.timezone)}
              <small>{demo.timezone}</small>
            </p>
          )}
          <DemoNote>
            No appointment was booked, no payment was taken, and no contact
            information was sent or retained. This preview resets on refresh.
          </DemoNote>
          <Button
            onClick={() => {
              close();
              navigate("/dashboard");
            }}
          >
            View my space <ArrowRight size={16} />
          </Button>
          <Button variant="ghost" onClick={close}>
            Continue exploring
          </Button>
        </div>
      ) : step === "review" ? (
        <div className="svc-form">
          <span className="svc-eyebrow">REVIEW YOUR DEMO REQUEST</span>
          <h3>{service.title}</h3>
          <dl className="svc-summary">
            <div>
              <dt>Professional</dt>
              <dd>{provider?.name} · demo profile</dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>{format}</dd>
            </div>
            <div>
              <dt>Session</dt>
              <dd>
                {slot && formatSlot(slot.startsAt, demo.timezone)}
                <small>{demo.timezone}</small>
              </dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{service.duration} minutes</dd>
            </div>
            <div>
              <dt>Example price</dt>
              <dd>{demo.price(previous || service)} · no payment</dd>
            </div>
            {!previous && (
              <div>
                <dt>Contact preview</dt>
                <dd>
                  {name}
                  <small>{email}</small>
                </dd>
              </div>
            )}
          </dl>
          <LocationNote format={format} />
          <DemoNote>
            Confirming only adds a sample appointment to your temporary
            dashboard. Contact details are discarded.
          </DemoNote>
          <Button onClick={confirm}>
            {previous ? "Confirm demo reschedule" : "Confirm demo booking"}{" "}
            <ArrowRight size={16} />
          </Button>
          <Button variant="secondary" onClick={() => setStep("details")}>
            <ArrowLeft size={15} /> Edit details
          </Button>
        </div>
      ) : (
        <form
          className="svc-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!slot) {
              setError("Choose an available date and time.");
              return;
            }
            setError("");
            setStep("review");
          }}
        >
          <p>
            {service.title} · {service.duration} minutes ·{" "}
            <strong>{demo.price(service)}</strong>
          </p>
          <DemoNote>
            Illustrative availability and prices. No real session or payment.
          </DemoNote>
          {error && (
            <p className="svc-error" role="alert">
              {error}
            </p>
          )}
          <Select
            label="Professional"
            value={professional}
            required
            onChange={(e) => {
              setProfessional(e.target.value);
              setSlotId("");
              setDate("");
            }}
          >
            {service.professionalIds
              .filter(
                (id) => demo.professionals.find((p) => p.id === id)?.active,
              )
              .map((id) => (
                <option key={id} value={id}>
                  {demo.professionals.find((p) => p.id === id)?.name} · demo
                  profile
                </option>
              ))}
          </Select>
          <Select
            label="Session format"
            value={format}
            onChange={(e) => {
              setFormat(e.target.value as SessionFormat);
              setSlotId("");
              setDate("");
            }}
          >
            {service.formats.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </Select>
          <div className="svc-form-columns">
            <Select
              label="Session date"
              value={currentDate}
              required
              onChange={(e) => {
                setDate(e.target.value);
                setSlotId("");
              }}
            >
              {dates.length ? (
                dates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))
              ) : (
                <option value="">No demo dates available</option>
              )}
            </Select>
            <Select
              label="Session time"
              value={slotId}
              required
              onChange={(e) => setSlotId(e.target.value)}
            >
              <option value="">Choose a time</option>
              {times.map((s) => (
                <option key={s.id} value={s.id}>
                  {new Intl.DateTimeFormat("en-GB", {
                    timeZone: demo.timezone,
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(s.startsAt))}
                </option>
              ))}
            </Select>
          </div>
          <small>
            All appointment times shown in {demo.timezone}.{" "}
            {demo.region === "International"
              ? "Prices are independent USD examples, not converted from RWF."
              : "Prices are illustrative RWF amounts."}
          </small>
          <LocationNote format={format} />
          {!previous && (
            <>
              <Input
                label="Your name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
              />
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <small>
                Only used to preview this request. Please do not enter health
                history or sensitive details.
              </small>
            </>
          )}
          <Checkbox
            label="I understand this is a demo, not a real appointment."
            required
          />
          <Button type="submit" disabled={!choices.length}>
            Review demo request <ArrowRight size={16} />
          </Button>
        </form>
      )}
    </Modal>
  );
}
