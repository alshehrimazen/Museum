import { Component, OnInit } from '@angular/core';
import { LikeService } from '../services/like.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-like',
  templateUrl: './like.page.html',
  styleUrls: ['./like.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LikePage implements OnInit {
  likedArtworks: any[] = [];

  constructor(private likeService: LikeService, private router: Router) { }

  ngOnInit() {
    this.likedArtworks = this.likeService.getLikes();
    console.log('Liked artworks:', this.likedArtworks);
  }

  ionViewDidEnter() {
    this.likedArtworks = this.likeService.getLikes(); // Refresh liked artworks when entering the page
  }

  removeLike(art: any) {
    this.likeService.removeLike(art);
    this.likedArtworks = this.likeService.getLikes();
  }

  goToDetails(objectID: number) {
    this.router.navigate(['/tabs/details', objectID]);
  }
}
