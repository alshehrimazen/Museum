import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvolvementService {
  private appID = 'pKSoTbGzFhj5RtoeFQif'; // You can change this to your own app ID
  private baseURL = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps';

  constructor(private http: HttpClient) { }

  // Fetch all likes (no parameter)
  getAllLikes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/${this.appID}/likes`);
  }

  // You can remove objectID from getLikes if not needed, or keep for compatibility
  getLikes(objectID: number): Observable<any> {
    return this.http.get(`${this.baseURL}/${this.appID}/likes`);
  }

  postLike(objectID: number): Observable<any> {
    return this.http.post(
      `${this.baseURL}/${this.appID}/likes`,
      { item_id: objectID },
      { responseType: 'text' } //
    );
  }

  getComments(objectID: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/${this.appID}/comments?item_id=${objectID}`);
  }

  postComment(objectID: number, username: string, comment: string): Observable<any> {
    return this.http.post(`${this.baseURL}/${this.appID}/comments`, {
      item_id: objectID,
      username: username,
      comment: comment
    });
  }
}
