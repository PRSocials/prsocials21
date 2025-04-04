import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// This component will scroll the window to the top whenever the pathname changes
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Custom hook version if needed in individual components
export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}
