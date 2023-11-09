import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'viewvideo/:id',
    loadComponent: () => import('./pages/viewvideo/viewvideo.page').then( m => m.ViewvideoPage)
  },
];

