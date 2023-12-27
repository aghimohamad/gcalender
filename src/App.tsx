import Calendar from "./components/Calendar.tsx";
import { EventsProvider } from "./context/Events";

function App() {
  return (
    <EventsProvider>
      <Calendar />
    </EventsProvider>
  );
}

export default App;
