import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppNotification {
  title: string;
  body: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly storageKey = 'app_notifications';
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  private notifications: AppNotification[] = [];

  constructor() {
    this.loadFromStorage(); // Load existing notifications
  }

  addNotification(notification: AppNotification) {
    this.notifications.unshift(notification); // Add new notification
    if (this.notifications.length > 10) {
      this.notifications.pop(); // keep only latest 10
    }
    this.saveToStorage();
    this.notificationsSubject.next(this.notifications); // emit new state
  }

  getNotifications(): Observable<AppNotification[]> {
    return this.notificationsSubject.asObservable();
  }

  clearNotifications() {
    this.notifications = [];
    localStorage.removeItem(this.storageKey);
    this.notificationsSubject.next(this.notifications);
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const rawList = JSON.parse(stored);
      this.notifications = rawList.map((n: any) => ({
        ...n,
        date: new Date(n.date),
      }));
      this.notificationsSubject.next(this.notifications);
    }
  }
}
