import { useLocationChange } from "raviger";
import { ReactNode, createContext, useRef, useState } from "react";

export const HistoryContext = createContext<string[]>([]);

export const ResetHistoryContext = createContext(() => {});

export const SignalBackNavigationContext = createContext(() => {});

export default function HistoryAPIProvider(props: { children: ReactNode }) {
  const [history, setHistory] = useState<string[]>([]);
  const isBackNavigation = useRef(false);

  useLocationChange(
    (newLocation) => {
      const newPath = newLocation.fullPath + newLocation.search;
      setHistory((history) => {
        if (isBackNavigation.current) {
          isBackNavigation.current = false;
          // Pop current entry (the page we're leaving)
          const popped = history.slice(1);

          // If destination exists in remaining stack, unwind to it
          // (removes intermediate pages like create-invoice between invoice and account)
          const idx = popped.indexOf(newPath);
          if (idx >= 0) return popped.slice(idx);

          // Destination not in stack — push it on top of popped stack
          return [newPath, ...popped];
        }

        if (history.length && newPath === history[0])
          // Ignore push if navigate to same path (for some weird unknown reasons?)
          return history;

        if (history.length > 1 && newPath === history[1])
          // Pop current path if navigate back to previous path
          return history.slice(1);

        // Otherwise just push the current path
        return [newPath, ...history];
      });
    },
    { onInitial: true },
  );
  const resetHistory = () => setHistory((history) => history.slice(0, 1));

  const signalBackNavigation = () => {
    isBackNavigation.current = true;
  };

  return (
    <HistoryContext.Provider value={history}>
      <ResetHistoryContext.Provider value={resetHistory}>
        <SignalBackNavigationContext.Provider value={signalBackNavigation}>
          {props.children}
        </SignalBackNavigationContext.Provider>
      </ResetHistoryContext.Provider>
    </HistoryContext.Provider>
  );
}
