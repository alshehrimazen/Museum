import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArtworkService } from '../services/artwork.service';
import { Artwork } from '../models/artwork.model';
import { forkJoin } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvolvementService } from '../services/involvement.service';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
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
    private involvementService: InvolvementService
  ) { }

  ngOnInit() {
    // Fetch likes first
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
    this.router.navigate(['/details', objectID]);
  }

  likeArtwork(objectID: number, event: Event) {
    event.stopPropagation();
    if (this.likedSet.has(objectID)) return; // Prevent multiple likes per session
    console.log(`Attempting to like artwork with ID: ${objectID}`);
    this.involvementService.postLike(objectID).subscribe(() => {
      // Refetch all likes to get the updated count
      console.log(`Liked artwork with ID: ${objectID}`);
      this.involvementService.getAllLikes().subscribe(likes => {
        likes.forEach(like => {
          this.likesMap[like.item_id] = like.likes;
          console.log(`Updated likes for ${like.item_id}: ${like.likes}`);
        });
        this.likedSet.add(objectID); // Only block after updating
      });
    });
  }
}
