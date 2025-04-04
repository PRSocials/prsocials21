import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * This component automatically scrolls the window to the top when the route changes.
 * It should be placed inside the Router component, but outside of Routes to work properly.
 */
const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

export default ScrollToTopOnRouteChange;