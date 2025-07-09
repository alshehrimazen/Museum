export interface Artwork {
  objectID: number;
  title: string;
  artistDisplayName: string;
  primaryImageSmall: string;
  objectDate: string;
  medium: string;
  dimensions: string;
  creditLine: string;
  department: string;
  [key: string]: any; // allows other optional properties
}
