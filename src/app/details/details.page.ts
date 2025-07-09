import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../services/artwork.service';
import { InvolvementService } from '../services/involvement.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class DetailsPage implements OnInit {
  objectID: number = 0;
  artwork: any;
  likes: number = 0;
  comments: any[] = [];
  newComment: string = '';

  constructor(
    private route: ActivatedRoute,
    private artworkService: ArtworkService,
    private involvementService: InvolvementService
  ) { }

  ngOnInit() {
    this.objectID = Number(this.route.snapshot.paramMap.get('id') || '0');

    // Get artwork details
    this.artworkService.getObjectDetails(this.objectID).subscribe(data => {
      this.artwork = data;
    });

    // Get likes
    this.involvementService.getLikes(this.objectID).subscribe((data: any[]) => {
      const item = data.find((d: any) => d.item_id === this.objectID);
      this.likes = item ? item.likes : 0;
    });

    // Get comments
    this.involvementService.getComments(this.objectID).subscribe((data: any[]) => {
      this.comments = data;
    });
  }

  addLike() {
    this.involvementService.postLike(this.objectID).subscribe(() => {
      this.likes++;
    });
  }

  addComment() {
    if (this.newComment.trim()) {
      this.involvementService
        .postComment(this.objectID, 'User', this.newComment)
        .subscribe(() => {
          this.comments.push({
            username: 'User',
            comment: this.newComment,
            creation_date: new Date().toISOString(),
          });
          this.newComment = '';
        });
    }
  }
}
