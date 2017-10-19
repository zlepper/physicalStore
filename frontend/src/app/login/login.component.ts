import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/delay';
import '../operators/delayAtLeast';
import {AuthService} from '../services/auth.service';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  public email = '';
  public password = '';
  public rememberMe = false;
  public authenticating = false;
  public loginFailed = false;
  public loginArgs: Observable<any>;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.loginArgs = this.route.queryParams;
  }


  public login() {
    this.authenticating = true;
    const rememberMe = this.rememberMe;
    this.authService.login(this.email, this.password, rememberMe)
      .delayAtLeast(500)
      .subscribe(() => {
        this.route.queryParams.take(1)
          .subscribe(params => {
            const redirectLink = params.redirect || 'lists';
            this.router.navigate([redirectLink]);
          });
      }, err => {
        this.authenticating = false;
        this.loginFailed = true;
      });
  }
}
