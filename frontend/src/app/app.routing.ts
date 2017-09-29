import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

export const routes = RouterModule.forRoot(appRoutes);
