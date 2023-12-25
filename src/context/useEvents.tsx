import { useContext } from "react";
import { EventsContext } from "./Events";

const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (context == undefined) {
    throw new Error("useEventsContext must be used within a EventsProvider");
  }
  return context;
};
export default useEventsContext;
