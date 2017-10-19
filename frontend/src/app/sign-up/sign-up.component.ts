import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signupFailed: boolean;

  public repeatPassword: string;
  public password: string;
  public email: string;
  public rememberMe: boolean;

  public loginArgs: Observable<any>;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.loginArgs = this.route.queryParams;
  }

  public signup() {
    if (this.repeatPassword === this.password) {
      this.authService.signup(this.email, this.password, this.rememberMe)
        .subscribe(() => {
          this.route.params.take(1)
            .subscribe(params => {
              const redirectLink = params.redirect || 'lists';
              this.router.navigate([redirectLink]);
            });
        }, err => {
          this.signupFailed = true;
        });
    }
  }

}
