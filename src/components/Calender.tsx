import {
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, { Fragment } from "react";
import cc from "../utils/cc";
import Modal from "./Modal";
import useEventsContext from "../context/useEvents";
import { UnionOmit } from "../utils/types";
import { Colors, Event } from "../context/Events";
import { formatDate } from "../utils/formatDate";
import { ModalProps } from './Modal';
import OverFlowContainer from "./overFlowContainer";

function Calender() {
  const [visibleMonth, setVisibleMonth] = React.useState(new Date());

  function showNextMonth() {
    setVisibleMonth((prev) => {
      return addMonths(prev, 1);
    });
  }

  function showPreviousMonth() {
    setVisibleMonth((prev) => {
      return addMonths(prev, -1);
    });
  }

  function showCurrentMonth() {
    setVisibleMonth(new Date());
  }

  const visibleDates = eachDayOfInterval({
    start: startOfWeek(startOfMonth(visibleMonth)),
    end: endOfWeek(endOfMonth(visibleMonth)),
  });

  return (
    <div className="calendar">
      <div className="header">
        <button className="btn" onClick={showCurrentMonth}>
          Today
        </button>
        <div>
          <button className="month-change-btn" onClick={showPreviousMonth}>
            &lt;
          </button>
          <button className="month-change-btn" onClick={showNextMonth}>
            &gt;
          </button>
        </div>
        <span className="month-title">
          {formatDate(visibleMonth, {
            month: "long",
            year: "2-digit",
          })}
        </span>
      </div>
      <div className="days">
        {visibleDates.map((date, index) => (
          <CalanderDay
            key={index}
            date={date}
            index={index}
            visibleMonth={visibleMonth}
          />
        ))}
      </div>
    </div>
  );
}

export default Calender;

type CalanderDayProps = {
  date: Date;
  index: number;
  visibleMonth: Date;
};

const CalanderDay = ({ date, index, visibleMonth }: CalanderDayProps) => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const { addEvent, events } = useEventsContext();
  console.log("🚀 ~ file: Calender.tsx:84 ~ CalanderDay ~ events:", events);

  const sortedEvents = events.filter((event) => isSameDay(event.date, date)).sort((a, b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    if (a.allDay && b.allDay) return 0;
    if (a.start && b.start) return a.start.localeCompare(b.start);
    return 0;
  });

  return (
    <div
      className={cc(
        "day",
        !isSameMonth(date, visibleMonth) && "non-month-day",
        isBefore(endOfDay(date), visibleMonth) && "old-month-day"
      )}
    >
      <div className="day-header">
        {index < 7 && <div className="week-name">{format(date, "EEE")}</div>}
        <div className="day-number">{format(date, "d")}</div>
        <button className="add-event-btn" onClick={() => setVisibleModal(true)}>
          +
        </button>
        <EventModal
          date={date}
          isOpen={visibleModal}
          onClose={() => setVisibleModal(false)}
          onSubmit={addEvent}
        />
      </div>
      {sortedEvents.length > 0 && (
        <OverFlowContainer
          className="events"
          items={sortedEvents}
          renderItem={(event) => <EventItem event={event} />}
          getKey={(event) => event.id}
          renderOverflow={(overflowAmount) => (
            <div className="events-view-more-btn">+{overflowAmount}</div>
          )}
        />
      )}
      {/* <div className="events">
        {sortedEvents
          .filter((event) => isSameDay(event.date, date))
          .map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
      </div> */}
    </div>
  );
};

type EventModalProps = {
  onSubmit: (event: UnionOmit<Event, "id">) => void;
} & Omit<ModalProps, 'children'> & (
    { date: Date, onDelete?: never , event?: never } |
    { event: Event, onDelete: () => void  , date?: never}
)

function EventModal({ event, date, onSubmit, onDelete, ...modalProps}: EventModalProps ) {
  const [isAllDay, setIsAllDay] = React.useState(event?.allDay || false);
  const [startTime, setStartTime] = React.useState(event?.start || "");
  const endTimeRef = React.useRef<HTMLInputElement>(null);
  const [selectedColor, setSelectedColor] = React.useState<
    "red" | "green" | "blue"
  >(event?.color || Colors[0]);
  const nameRef = React.useRef<HTMLInputElement>(null);
  // const id = useId()


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = nameRef.current?.value;

    if (!name) return;

    const common = {
      title: name,
      color: selectedColor,
      date: date ?? event?.date,
    };

    let newEvent: UnionOmit<Event, "id">;

    if (isAllDay) {
      newEvent = {
        ...common,
        allDay: true,
      };
    } else {
      const endTime = endTimeRef.current?.value;

      if (!endTime || !startTime) return;

      newEvent = {
        ...common,
        allDay: false,
        start: startTime,
        end: endTime,
      };
    }

    modalProps.onClose();
    onSubmit(newEvent);
  };

  return (
    <Modal {...modalProps}>
      <div className="modal-title">
        <div>Add Event</div>
        <small>{formatDate(date ?? event?.date, { dateStyle: "short" })}</small>
        <button className="close-btn" onClick={modalProps.onClose}>
          &times;
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input ref={nameRef} type="text" required name="name" id="name" defaultValue={event?.title} />
        </div>
        <div className="form-group checkbox">
          <input
            type="checkbox"
            name="all-day"
            id="all-day"
            checked={isAllDay}
            onChange={(e) => setIsAllDay(e.target.checked)}
          />
          <label htmlFor="all-day">All Day?</label>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="start-time">Start Time</label>
            <input
              type="time"
              name="start-time"
              id="start-time"
              disabled={isAllDay}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-time">End Time</label>
            <input
              type="time"
              name="end-time"
              id="end-time"
              disabled={isAllDay}
              defaultValue={event?.end}
              min={startTime}
              ref={endTimeRef}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Color</label>
          <div className="row left">
            {Colors.map((color) => (
              <Fragment key={color}>
                <input
                  type="radio"
                  name="color"
                  value={color}
                  id={color}
                  checked={selectedColor === color}
                  onChange={() => setSelectedColor(color)}
                  className="color-radio"
                />
                <label htmlFor={color}>
                  <span className="sr-only">{color}</span>
                </label>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="row">
          <button className="btn btn-success" type="submit">
            Add
          </button>
          {event && <button className="btn btn-delete" type="button"
          onClick={onDelete}
          >
            Delete
          </button>}
        </div>
      </form>
    </Modal>
  );
}

const EventItem = ({ event }: { event: Event }) => {

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const { removeEvent, EditEvent } = useEventsContext()

  return (
    <>
      <button
        className={cc(
          event.allDay && "all-day-event ",
          event.allDay && event.color,
          "event"
        )}
        onClick={() => setIsModalOpen(true)}
      >
        {!event.allDay && <>
          <div className={`color-dot ${event.color}`}></div>
          <div className="event-time">
          {formatDate(parse(event.start, "HH:mm", event.date), {
                timeStyle: "short",
              })}
          </div>
        </>}
        <div className="event-name">{event.title}</div>
      </button>
      {/* <button className="event">
    
    <div className="event-name">Event Name</div>
  </button> */}
      <EventModal event={event} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onDelete={() => removeEvent(event.id)} onSubmit={(e) => EditEvent(event.id , e) } />
    </>
  );
};
