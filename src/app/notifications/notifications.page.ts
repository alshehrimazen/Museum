import { Component, OnInit } from '@angular/core';
import { AppNotification, NotificationService } from '../services/notification.service';
import { IonHeader, IonToolbar, IonText, IonContent, IonTitle, IonList, IonLabel, IonItem, IonButtons, IonBackButton, IonButton, IonIcon } from "@ionic/angular/standalone";
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  imports: [CommonModule, IonIcon, IonButton, IonBackButton, IonButtons, IonItem, IonLabel, IonList, IonTitle, IonContent, IonHeader, IonToolbar, IonText],
})
export class NotificationsPage implements OnInit {
  notifications: Observable<AppNotification[]> | undefined;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.notifications = this.notificationService.getNotifications();
  }
  clearAll() {
    this.notificationService.clearNotifications();
    this.notifications = this.notificationService.getNotifications();
  }

}
