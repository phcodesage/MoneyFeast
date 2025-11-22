import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../lib/analytics';

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    analytics.pageView({
      path: location.pathname + location.search,
      title: document.title,
    });
  }, [location]);
}
