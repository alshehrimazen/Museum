import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
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

  // New method to get object IDs by department
  getArtworksByDepartmentName(name: string): Observable<number[]> {
    console.log(`Searching artworks in department: ${name}`);
    const url = `${this.baseUrl}/search?q=${encodeURIComponent(name)}&department==${encodeURIComponent(name)}`;
    return this.http.get<{ objectIDs: number[] }>(url).pipe(
      map(res => res.objectIDs || [])
    );
  }


  // New method to get full object details by ID list
  getObjectsDetails(ids: number[]): Observable<Artwork[]> {
    const requests = ids.map((id) => this.getObjectDetails(id));
    return forkJoin(requests);
  }
}
