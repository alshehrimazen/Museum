import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArtworkService } from '../services/artwork.service';
import { Artwork } from '../models/artwork.model';
import { forkJoin } from 'rxjs';

import { InvolvementService } from '../services/involvement.service';
import { LikeService } from '../services/like.service';
import { NotificationService } from '../services/notification.service';


import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonHeader,
  IonToolbar,
  IonTitle, IonButtons
} from "@ionic/angular/standalone";

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  standalone: true,
  imports: [IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonIcon,
    IonButton,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
  ],
})
export class Tab1Page implements OnInit {
  artworks: Artwork[] = [];
  allIds: number[] = [];
  batchSize = 7;
  currentIndex = 0;
  loading = false;
  likesMap: { [key: string]: number } = {};
  likedSet = new Set<number>();

  constructor(
    private artworkService: ArtworkService,
    private router: Router,
    private involvementService: InvolvementService,
    private likeService: LikeService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.initializePushNotifications();

    this.involvementService.getAllLikes().subscribe(likes => {
      likes.forEach(like => {
        this.likesMap[like.item_id] = like.likes;
      });

      this.artworkService.searchPaintings().subscribe((res) => {
        this.allIds = res.objectIDs;
        this.loadMoreArtworks();
      });
    });
  }

  initializePushNotifications() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.error('Push permission not granted');
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {

      console.log('Push received: ' + JSON.stringify(notification));
      this.notificationService.addNotification({
        title: notification.title ?? 'No title',
        body: notification.body ?? 'No body',
        date: new Date()
      });

    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      alert('Push action performed: ' + JSON.stringify(notification));
    });
  }

  loadMoreArtworks(event?: any) {
    if (this.loading) return;
    this.loading = true;
    const nextIds = this.allIds.slice(this.currentIndex, this.currentIndex + this.batchSize);
    const requests = nextIds.map((id: number) => this.artworkService.getObjectDetails(id));
    forkJoin(requests).subscribe((arts) => {
      this.artworks = [...this.artworks, ...arts];
      this.currentIndex += this.batchSize;
      this.loading = false;
      if (event) event.target.complete();
    });
  }

  goToDetails(objectID: number) {
    this.router.navigate(['/tabs/details', objectID]);
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  likeArtwork(art: any, event: Event) {
    event.stopPropagation();
    const objectID = art.objectID;

    if (this.likedSet.has(objectID)) {
      this.likedSet.delete(objectID);
      this.likeService.removeLike(art);
      if (this.likesMap[objectID] && this.likesMap[objectID] > 0) {
        this.likesMap[objectID]--;
      }
    } else {
      this.involvementService.postLike(objectID).subscribe(() => {
        this.involvementService.getAllLikes().subscribe(likes => {
          likes.forEach(like => {
            this.likesMap[like.item_id] = like.likes;
          });
          this.likedSet.add(objectID);
          this.likeService.addLike(art);
        });
      });
    }
  }
}