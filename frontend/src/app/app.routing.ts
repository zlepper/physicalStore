import {RouterModule, Routes} from '@angular/router';
import {ListsComponent} from './lists/lists.component';
import {OpenListComponent} from './lists/open-list/open-list.component';
import {LoginComponent} from './login/login.component';
import {IsAuthenticatedGuard} from './services/is-authenticated.guard';
import {SignUpComponent} from "./sign-up/sign-up.component";

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignUpComponent
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
