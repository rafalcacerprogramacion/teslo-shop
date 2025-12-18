import { Routes } from '@angular/router';
import { IsAdminGuard } from '@authguards/is-admin.guard';
import { NotAuthenticatedGuard } from '@authguards/not-authenticated';

export const routes: Routes = [

   {
      path: 'auth',
      loadChildren: () => import('./auth/auth.routes'),
      canMatch: [
         NotAuthenticatedGuard
      ]
   },
   {
      path: 'admin',
      loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
      canMatch: [
         IsAdminGuard
      ]
   },
   {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes'),
   }
];
