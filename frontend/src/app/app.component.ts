import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthService} from './services/auth.service';
import {LanguageService} from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  public authenticated: Observable<boolean>;

  constructor(public authService: AuthService, private router: Router, private languageService: LanguageService) {
    this.authenticated = authService.authenticated;
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
