import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import 'rxjs/add/operator/take';
import {Observable} from 'rxjs/Observable';
import {AuthService} from './auth.service';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.authenticated
      .take(1)
      .do(authenticated => {
        if (!authenticated) {
          this.router.navigate(['login'], {
            queryParams: {
              redirect: state.url,
            },
          });
        }
      });
  }
}
