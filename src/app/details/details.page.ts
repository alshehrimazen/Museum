import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../services/artwork.service';
import { InvolvementService } from '../services/involvement.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { timer } from 'rxjs';

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
  newName: string = '';
  newComment: string = '';
  nameError: string = '';
  commentError: string = '';

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
    this.validateName();
    this.validateComment();

    if (this.nameError || this.commentError) {
      return;
    }
    if (this.newName.trim() && this.newComment.trim()) {
      const name = this.newName;
      const comment = this.newComment;
      this.newName = '';
      this.newComment = '';
      this.involvementService
        .postComment(this.objectID, name, comment)
        .subscribe(() => {
          this.comments.push({
            username: name,
            comment: comment,
            creation_date: new Date().toISOString(),
          });


        });
    }
    timer(2000).subscribe(() => {
      this.involvementService.getComments(this.objectID).subscribe((data: any[]) => {
        this.comments = data;
      });
    });
  }

  validateName() {
    const invalidPattern = /[0-9@$%^&*#!\\]/;
    if (!this.newName.trim()) {
      this.nameError = 'Name is required.';
    } else if (invalidPattern.test(this.newName)) {
      this.nameError = 'Name cannot contain numbers or special characters.';
    } else {
      this.nameError = '';
    }
  }

  validateComment() {
    const invalidPattern = /[0-9@$%^&*#!\\]/;
    if (!this.newComment.trim()) {
      this.commentError = 'Comment is required.';
    } else if (invalidPattern.test(this.newComment)) {
      this.commentError = 'Comment cannot contain numbers or special characters.';
    } else {
      this.commentError = '';
    }
  }
}
