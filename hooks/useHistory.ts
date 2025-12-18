import { useState, useCallback } from "react";

export default function useHistory<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setState = useCallback(
    (newState: T) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, currentIndex + 1);
        return [...newHistory, newState];
      });
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex]
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      return history[currentIndex - 1]; // Return usage if needed, but state is derived usually
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  const currentState = history[currentIndex];

  return {
    state: currentState,
    setState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
}
