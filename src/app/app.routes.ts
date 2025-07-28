import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./details/details.page').then(m => m.DetailsPage)
  },
  {
    path: 'like',
    loadComponent: () => import('./like/like.page').then( m => m.LikePage)
  },
  {
    path: 'department-artworks',
    loadComponent: () => import('./department-artworks/department-artworks.page').then( m => m.DepartmentArtworksPage)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/notifications.page').then( m => m.NotificationsPage)
  },
];
