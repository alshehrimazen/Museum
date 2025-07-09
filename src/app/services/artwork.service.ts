import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artwork } from '../models/artwork.model';

@Injectable({
  providedIn: 'root',
})
export class ArtworkService {
  private baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1';

  constructor(private http: HttpClient) { }

  searchPaintings(): Observable<any> {
    const url = `${this.baseUrl}/search?q=painting&hasImages=true`;
    return this.http.get<any>(url);
  }

  getObjectDetails(id: number): Observable<Artwork> {
    const url = `${this.baseUrl}/objects/${id}`;
    return this.http.get<Artwork>(url);
  }
}
