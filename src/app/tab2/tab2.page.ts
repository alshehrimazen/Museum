import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  IonList,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Artwork } from '../models/artwork.model';
import { ArtworkService } from '../services/artwork.service';
import { Router } from '@angular/router';
import { InvolvementService } from '../services/involvement.service';
import { LikeService } from '../services/like.service';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  searchTerm = '';
  results: any[] = [];
  searched = false;
  artworks: Artwork[] = [];
  allIds: number[] = [];
  batchSize = 7;
  currentIndex = 0;
  loading = false;
  likesMap: { [key: string]: number } = {};
  likedSet = new Set<number>();

  constructor(private http: HttpClient, private artworkService: ArtworkService,
    private router: Router,
    private involvementService: InvolvementService,
    private likeService: LikeService) { }
  ngOnInit(): void { // Fetch likes first
    this.involvementService.getAllLikes().subscribe(likes => {
      likes.forEach(like => {
        this.likesMap[like.item_id] = like.likes;
      });
      // Then fetch artworks
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
    if (!this.searchTerm.trim()) {
      this.results = [];
      this.searched = true;
      return;
    }
    // Example: Metropolitan Museum of Art Collection API
    const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(this.searchTerm)}`;
    this.http.get<any>(url).subscribe(res => {
      if (res.objectIDs && res.objectIDs.length > 0) {
        // Fetch details for the first 10 results
        const requests = res.objectIDs.slice(0, 10).map((id: number) =>
          this.http.get<any>(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
        );
        Promise.all(requests.map((req: Observable<any>) => req.toPromise())).then(details => {
          this.results = details;
          this.searched = true;
        });
      } else {
        this.results = [];
        this.searched = true;
      }
    });
  }



}
