import {RouterModule, Routes} from '@angular/router';
import {ListsComponent} from './lists/lists.component';
import {OpenListComponent} from './lists/open-list/open-list.component';
import {LoginComponent} from './login/login.component';
import {IsAuthenticatedGuard} from './services/is-authenticated.guard';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'lists',
    component: ListsComponent,
    canActivate: [IsAuthenticatedGuard],
  },
  {
    path: 'lists/:id',
    component: OpenListComponent,
    canActivate: [IsAuthenticatedGuard],
  },
  {
    path: '',
    redirectTo: 'lists',
    pathMatch: 'full',
  }
];

export const routes = RouterModule.forRoot(appRoutes);
