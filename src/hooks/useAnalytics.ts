import { useEffect, useState } from 'react';
import { Analytics } from 'firebase/analytics';
import { initFirebase, initAnalytics } from '@/lib/firebase';

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const app = initFirebase();
      const analyticsInstance = initAnalytics(app);
      setAnalytics(analyticsInstance);
    }
  }, []);

  return analytics;
}; 