import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { timer } from 'rxjs';

import { ArtworkService } from '../services/artwork.service';
import { InvolvementService } from '../services/involvement.service';

import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonButton, IonItem, IonInput, IonList, IonLabel
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonLabel, IonList, IonInput, IonItem, IonButton, IonContent,
    IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader,
  ],
})
export class DetailsPage implements OnInit {
  objectID: number = 0;
  artwork: any;
  likes: number = 0;
  comments: any[] = [];

  nameControl = new FormControl('');
  commentControl = new FormControl('');
  nameError: string = '';
  commentError: string = '';

  constructor(
    private route: ActivatedRoute,
    private artworkService: ArtworkService,
    private involvementService: InvolvementService
  ) { }

  ngOnInit() {
    this.objectID = Number(this.route.snapshot.paramMap.get('id') || '0');

    this.artworkService.getObjectDetails(this.objectID).subscribe(data => {
      this.artwork = data;
    });

    this.involvementService.getLikes(this.objectID).subscribe((data: any[]) => {
      const item = data.find((d: any) => d.item_id === this.objectID);
      this.likes = item ? item.likes : 0;
    });

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

    if (this.nameError || this.commentError) return;

    const name = this.nameControl.value?.trim();
    const comment = this.commentControl.value?.trim();

    if (name && comment) {
      this.involvementService.postComment(this.objectID, name, comment).subscribe(() => {
        // Optionally add it instantly to the list
        this.comments.push({
          username: name,
          comment: comment,
          creation_date: new Date().toISOString(),
        });

        // Clear input fields
      });

      this.nameControl.reset();
      this.commentControl.reset();

      // Refresh comment list after 2 seconds
      timer(2000).subscribe(() => {
        this.involvementService.getComments(this.objectID).subscribe((data: any[]) => {
          this.comments = data;
        });
      });
    }
  }

  validateName() {
    const name = this.nameControl.value || '';
    const invalidPattern = /[0-9@$%^&*#!\\]/;
    if (!name.trim()) {
      this.nameError = 'Name is required.';
    } else if (invalidPattern.test(name)) {
      this.nameError = 'Name cannot contain numbers or special characters.';
    } else {
      this.nameError = '';
    }
  }

  validateComment() {
    const comment = this.commentControl.value || '';
    const invalidPattern = /[0-9@$%^&*#!\\]/;
    if (!comment.trim()) {
      this.commentError = 'Comment is required.';
    } else if (invalidPattern.test(comment)) {
      this.commentError = 'Comment cannot contain numbers or special characters.';
    } else {
      this.commentError = '';
    }
  }
}
