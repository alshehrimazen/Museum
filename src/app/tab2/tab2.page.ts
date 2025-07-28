import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonInput,
  IonList, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';

import { ArtworkService } from '../services/artwork.service';
import { InvolvementService } from '../services/involvement.service';
import { LikeService } from '../services/like.service';
import { Router } from '@angular/router';
import { Artwork } from '../models/artwork.model';

@Component({
  selector: 'app-tab2',
  standalone: true,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCard,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonItem, IonInput, IonList
  ]
})
export class Tab2Page implements OnInit {
  searchControl = new FormControl('');
  results: any[] = [];
  searched = false;
  artworks: Artwork[] = [];
  allIds: number[] = [];
  batchSize = 7;
  currentIndex = 0;
  loading = false;
  likesMap: { [key: string]: number } = {};
  likedSet = new Set<number>();

  constructor(
    private http: HttpClient,
    private artworkService: ArtworkService,
    private router: Router,
    private involvementService: InvolvementService,
    private likeService: LikeService
  ) { }

  ngOnInit(): void {
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

  loadMoreArtworks(event?: any) {
    if (this.loading) return;
    this.loading = true;

    const nextIds = this.allIds.slice(this.currentIndex, this.currentIndex + this.batchSize);
    const requests = nextIds.map(id => this.artworkService.getObjectDetails(id));

    forkJoin(requests).subscribe(arts => {
      this.artworks = [...this.artworks, ...arts];
      this.currentIndex += this.batchSize;
      this.loading = false;
      if (event) event.target.complete();
    });
  }

  goToDetails(objectID: number) {
    this.router.navigate(['/tabs/details', objectID]);
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

  searchArtworks() {
    const term = this.searchControl.value?.trim() || '';
    if (!term) {
      this.results = [];
      this.searched = true;
      return;
    }

    const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(term)}`;
    this.http.get<any>(url).subscribe(res => {
      if (res.objectIDs && res.objectIDs.length > 0) {
        const requests = res.objectIDs.slice(0, 10).map((id: number) =>
          this.http.get<any>(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
        );

        forkJoin(requests).subscribe(details => {
          this.results = details as any[];
          this.searched = true;
        });
      } else {
        this.results = [];
        this.searched = true;
      }
    });
  }
}
