import { Routes } from '@angular/router';
import { PagesRoutingModule } from './pages/pages-routing.module';
import { Error404Component } from './shared/pages/error404/error404.component';

export const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => PagesRoutingModule,
  },
  {
    path: '404',
    component: Error404Component
  },
  {
    path: '',
    redirectTo: 'pages',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
