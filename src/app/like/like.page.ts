import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LikeService } from '../services/like.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonList,
  IonCard,
  IonCardContent,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-like',
  standalone: true,
  templateUrl: './like.page.html',
  styleUrls: ['./like.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonList, IonCard, IonCardContent, IonIcon
  ],
})
export class LikePage implements OnInit {
  likedArtworks: any[] = [];

  constructor(private likeService: LikeService, private router: Router) { }

  ngOnInit() {
    this.refreshLikes();
  }

  ionViewDidEnter() {
    this.refreshLikes();
  }

  refreshLikes() {
    this.likedArtworks = this.likeService.getLikes();
  }

  removeLike(art: any) {
    this.likeService.removeLike(art);
    this.refreshLikes();
  }

  goToDetails(objectID: number) {
    this.router.navigate(['/tabs/details', objectID]);
  }
}
