import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'

import Calendar from "./Calendar.tsx";
import { EventsProvider } from "../context/Events";
import { addMonths } from "date-fns";
import { formatDate } from "../utils/formatDate";

describe("Calender", () => {
  it("should render with today date", () => {
    render(
      <EventsProvider>
        <Calendar />
      </EventsProvider>
    );
    const today = new Date();
    const todayMonth = today.toLocaleString("default", { month: "long" });
    const todayYear = today.toLocaleString("default", { year: "2-digit" });

    const date = screen.getByText(new RegExp(`${todayMonth} ${todayYear}`));
    expect(date).toBeInTheDocument();
  });

  it("should render with next month date and go back to today",async () => {
    render(
      <EventsProvider>
        <Calendar />
      </EventsProvider>
    );
    const user = userEvent.setup();
  
    
    const nextMonth = screen.getByText(">");
    await user.click(nextMonth)

    let today = new Date();
    today = addMonths(today, 1)
    const todayMonth = today.toLocaleString("default", { month: "long" });
    const todayYear = today.toLocaleString("default", { year: "2-digit" });

    const date = screen.getByText(new RegExp(`${todayMonth} ${todayYear}`));
    expect(date).toBeInTheDocument();

    const todayButton = screen.getByRole('button', { name: /today/i })
    await user.click(todayButton)

    const todayDate = formatDate(new Date(), {
      month: "long",
      year: "2-digit",
    })
    const todayDateText = screen.getByText(new RegExp(todayDate));
    expect(todayDateText).toBeInTheDocument();

  });
});
