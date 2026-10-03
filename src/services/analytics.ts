import { AnalyticsEvent } from '../types';

export class AnalyticsService {
  private static STORAGE_KEY = 'mup_analytics_events';

  public static track(eventName: AnalyticsEvent['eventName'], properties: Record<string, any> = {}): AnalyticsEvent {
    const event: AnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      eventName,
      properties,
      timestamp: new Date().toISOString()
    };

    try {
      const existing = localStorage.getItem(this.STORAGE_KEY);
      const list: AnalyticsEvent[] = existing ? JSON.parse(existing) : [];
      list.push(event);
      // Keep last 150 events in local storage
      if (list.length > 150) list.shift();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignore local storage quota errors
    }

    return event;
  }

  public static getEvents(): AnalyticsEvent[] {
    try {
      const existing = localStorage.getItem(this.STORAGE_KEY);
      return existing ? JSON.parse(existing) : [];
    } catch {
      return [];
    }
  }
}
