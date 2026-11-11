import { createContext, useContext, useState, type ReactNode } from "react";
import {
  services as seedServices,
  professionals as seedProfessionals,
  seedSlots,
  seedBookings,
  type Service,
  type Professional,
  type SessionSlot,
  type DemoBooking,
  type Region,
  type Enquiry,
} from "./data";

interface DemoState {
  region: Region;
  setRegion: (value: Region) => void;
  timezone: string;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  professionals: Professional[];
  setProfessionals: React.Dispatch<React.SetStateAction<Professional[]>>;
  slots: SessionSlot[];
  setSlots: React.Dispatch<React.SetStateAction<SessionSlot[]>>;
  bookings: DemoBooking[];
  setBookings: React.Dispatch<React.SetStateAction<DemoBooking[]>>;
  enquiries: Enquiry[];
  setEnquiries: React.Dispatch<React.SetStateAction<Enquiry[]>>;
  saved: string[];
  toggleSaved: (id: string) => void;
  request: {
    serviceId: string;
    professionalId?: string;
    rescheduleId?: string;
  } | null;
  setRequest: React.Dispatch<React.SetStateAction<DemoState["request"]>>;
  availableSlots: (
    serviceId: string,
    excludeBookingId?: string,
  ) => SessionSlot[];
  price: (value: { priceRwf: number; priceUsd: number }) => string;
}
const DemoContext = createContext<DemoState | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [region, setRegion] = useState<Region>("Rwanda");
  const [services, setServices] = useState(seedServices),
    [professionals, setProfessionals] = useState(seedProfessionals),
    [slots, setSlots] = useState(seedSlots),
    [bookings, setBookings] = useState(seedBookings),
    [saved, setSaved] = useState<string[]>([]),
    [request, setRequest] = useState<DemoState["request"]>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([
    {
      id: "enquiry-1",
      subject: "Accessibility arrangements",
      serviceId: "gentle-yoga",
      status: "New",
    },
    {
      id: "enquiry-2",
      subject: "Group session languages",
      serviceId: "peer-support",
      status: "New",
    },
    {
      id: "enquiry-3",
      subject: "Session preparation",
      serviceId: "guided-meditation",
      status: "Resolved",
    },
  ]);
  const timezone =
    region === "Rwanda"
      ? "Africa/Kigali"
      : Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const availableSlots = (serviceId: string, excludeBookingId?: string) => {
    const offering = services.find((service) => service.id === serviceId);
    if (!offering?.active) return [];
    return slots
      .filter(
        (slot) =>
          slot.serviceId === serviceId &&
          offering.formats.includes(slot.format) &&
          offering.professionalIds.includes(slot.professionalId) &&
          Date.parse(slot.startsAt) > Date.now() &&
          professionals.some(
            (p) =>
              p.id === slot.professionalId &&
              p.active &&
              p.formats.includes(slot.format),
          ) &&
          !bookings.some(
            (b) =>
              b.id !== excludeBookingId &&
              b.status === "Upcoming" &&
              b.professionalId === slot.professionalId &&
              Date.parse(b.startsAt) <
                Date.parse(slot.startsAt) +
                  (services.find((s) => s.id === serviceId)?.duration || 60) *
                    60000 &&
              Date.parse(b.startsAt) +
                (services.find((s) => s.id === b.serviceId)?.duration || 60) *
                  60000 >
                Date.parse(slot.startsAt),
          ),
      )
      .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  };
  const price = (value: { priceRwf: number; priceUsd: number }) => {
    const amount = region === "Rwanda" ? value.priceRwf : value.priceUsd;
    return amount === 0
      ? "Free"
      : new Intl.NumberFormat(region === "Rwanda" ? "en-RW" : "en-US", {
          style: "currency",
          currency: region === "Rwanda" ? "RWF" : "USD",
          currencyDisplay: region === "Rwanda" ? "code" : "symbol",
          maximumFractionDigits: 0,
        }).format(amount);
  };
  return (
    <DemoContext.Provider
      value={{
        region,
        setRegion,
        timezone,
        services,
        setServices,
        professionals,
        setProfessionals,
        slots,
        setSlots,
        bookings,
        setBookings,
        enquiries,
        setEnquiries,
        saved,
        toggleSaved: (id) =>
          setSaved((v) =>
            v.includes(id) ? v.filter((x) => x !== id) : [...v, id],
          ),
        request,
        setRequest,
        availableSlots,
        price,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("DemoProvider required");
  return value;
}
export function formatSlot(iso: string, timezone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
export function dateKey(iso: string, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  return ["year", "month", "day"]
    .map((k) => parts.find((p) => p.type === k)?.value)
    .join("-");
}
