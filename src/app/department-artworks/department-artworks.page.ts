import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../services/artwork.service';
import { of, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonInfiniteScrollContent,
  IonInfiniteScroll
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-department-artworks',
  templateUrl: './department-artworks.page.html',
  styleUrls: ['./department-artworks.page.scss'],
  standalone: true,
  imports: [
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonList,
    IonContent,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonHeader,
  ]
})
export class DepartmentArtworksPage implements OnInit {
  allIds: number[] = [];
  artworks: any[] = [];
  currentIndex: number = 0;
  batchSize: number = 12;
  loading: boolean = false;
  deptNamee: any;

  constructor(
    private route: ActivatedRoute,
    private artworkService: ArtworkService
  ) { }

  ngOnInit() {
    const deptName = this.route.snapshot.paramMap.get('id') || '';
    this.deptNamee = decodeURIComponent(deptName);



    this.artworkService.getArtworksByDepartmentName(deptName).subscribe((ids: number[]) => {

      this.allIds = ids;
      this.currentIndex = 0;
      this.artworks = [];
      this.loadMoreArtworks();
    });
  }

  loadMoreArtworks(event?: any) {
    if (this.loading || this.currentIndex >= this.allIds.length) {
      if (event) event.target.disabled = true;
      return;
    }

    this.loading = true;

    const nextIds = this.allIds.slice(this.currentIndex, this.currentIndex + this.batchSize);
    const requests = nextIds.map(id =>
      this.artworkService.getObjectDetails(id).pipe(
        catchError(() => of(null))
      )
    );

    forkJoin(requests).subscribe(async (arts) => {
      const validArts = arts.filter(
        (art) => art && art.primaryImageSmall && art.primaryImageSmall.trim() !== ''
      );

      this.artworks = [...this.artworks, ...validArts];
      this.currentIndex += this.batchSize;

      if ((validArts.length === 0 || validArts.length === 1) && this.currentIndex < this.allIds.length) {
        this.loading = false;
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.loadMoreArtworks(event);
        return;
      }

      this.loading = false;
      if (event) event.target.complete();
    });
  }

  goBack() {
    history.back();
  }
}
