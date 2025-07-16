import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private likedArtworks: any[] = [];

  constructor() { }

  getLikes() {
    return this.likedArtworks;
  }

  isLiked(art: any) {
    return this.likedArtworks.some(a => a.objectID === art.objectID);
  }

  addLike(art: any) {
    if (!this.isLiked(art)) {
      this.likedArtworks.push(art);
      console.log('Liked artworks:', this.likedArtworks);
    }
  }

  removeLike(art: any) {
    this.likedArtworks = this.likedArtworks.filter(a => a.objectID !== art.objectID);
    console.log('Liked artworks:', this.likedArtworks);
  }
}
