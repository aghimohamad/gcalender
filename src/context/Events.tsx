import { ReactNode, createContext, useEffect, useState } from "react";
import { UnionOmit } from "../utils/types";

export const Colors = ["red", "green", "blue"] as const;
export type Event = {
  id: string;
  title: string;
  color: (typeof Colors)[number];
  date: Date;
} & (
  | { start: string; end: string; allDay: false }
  | {
      start?: never;
      end?: never;
      allDay: true;
    }
);

type EventContextType = {
  events: Event[];
  // eslint-disable-next-line no-unused-vars
  addEvent: (event: UnionOmit<Event, "id">) => void;
  // eslint-disable-next-line no-unused-vars
  EditEvent: (id: string, event: UnionOmit<Event, "id">) => void;
  // eslint-disable-next-line no-unused-vars
  removeEvent: (id: string) => void;
};

export const EventsContext = createContext<EventContextType | null>(null);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useLocalStorage("EVENTS", [])

  const addEvent = (event: UnionOmit<Event, "id">) => {
    setEvents((prevEvents: Event[]) => [
      ...prevEvents,
      {
        ...event,
        id: crypto.randomUUID(),
      },
    ]);
  };

    const removeEvent = (id: string) => {
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    };

    const EditEvent = (id : string , event : UnionOmit<Event, "id"> ) => {
      setEvents((prevEvents) => prevEvents.map((ev) => ev.id === id ? {
        ...event,
        id: id,
      } : ev));
    };

  return (
    <EventsContext.Provider value={{ events, addEvent, removeEvent, EditEvent }}>
      {children}
    </EventsContext.Provider>
  );
}


function useLocalStorage(key: string, initialValue: Event[]) {
  const [value, setValue] = useState<Event[]>(() => {
    const jsonValue = localStorage.getItem(key)
    if (jsonValue == null) return initialValue

    return (JSON.parse(jsonValue) as Event[]).map(event => {
      // if (event.date instanceof Date) return event
      return { ...event, date: new Date(event.date) }
    })
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue] as const
}