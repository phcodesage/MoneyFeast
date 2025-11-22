// Analytics utility supporting multiple providers
// Configure your analytics provider in .env

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface PageView {
  path: string;
  title: string;
}

class Analytics {
  private isEnabled: boolean;
  private provider: 'google' | 'plausible' | 'custom' | null;

  constructor() {
    this.isEnabled = import.meta.env.PROD; // Only track in production
    this.provider = this.detectProvider();
  }

  private detectProvider(): 'google' | 'plausible' | 'custom' | null {
    if (typeof window === 'undefined') return null;
    
    // Detect Google Analytics
    if (window.gtag || window.ga) {
      return 'google';
    }
    
    // Detect Plausible
    if (window.plausible) {
      return 'plausible';
    }
    
    return 'custom';
  }

  // Track page views
  pageView({ path, title }: PageView) {
    if (!this.isEnabled) {
      console.log('[Analytics] Page view:', path, title);
      return;
    }

    switch (this.provider) {
      case 'google':
        if (window.gtag) {
          window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID || '', {
            page_path: path,
            page_title: title,
          });
        }
        break;
      
      case 'plausible':
        if (window.plausible) {
          window.plausible('pageview', { props: { path, title } });
        }
        break;
      
      case 'custom':
        // Implement your custom analytics here
        console.log('[Analytics] Page view:', path, title);
        break;
    }
  }

  // Track custom events
  event({ action, category, label, value }: AnalyticsEvent) {
    if (!this.isEnabled) {
      console.log('[Analytics] Event:', { action, category, label, value });
      return;
    }

    switch (this.provider) {
      case 'google':
        if (window.gtag) {
          window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
          });
        }
        break;
      
      case 'plausible':
        if (window.plausible) {
          window.plausible(action, { props: { category, label, value } });
        }
        break;
      
      case 'custom':
        // Implement your custom analytics here
        console.log('[Analytics] Event:', { action, category, label, value });
        break;
    }
  }

  // Track search queries
  search(query: string, resultsCount: number) {
    this.event({
      action: 'search',
      category: 'engagement',
      label: query,
      value: resultsCount,
    });
  }

  // Track newsletter subscriptions
  newsletterSubscribe(email: string) {
    this.event({
      action: 'newsletter_subscribe',
      category: 'conversion',
      label: email,
    });
  }

  // Track social shares
  socialShare(platform: string, postTitle: string) {
    this.event({
      action: 'share',
      category: 'social',
      label: `${platform}: ${postTitle}`,
    });
  }

  // Track post reads
  postRead(postSlug: string, postTitle: string) {
    this.event({
      action: 'post_read',
      category: 'content',
      label: `${postSlug}: ${postTitle}`,
    });
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    ga?: (...args: any[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
  }
}

export const analytics = new Analytics();
