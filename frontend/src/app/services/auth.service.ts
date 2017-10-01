import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {LocalStorageService} from './local-storage.service';

export interface ILoginResponse {
  token: string;
}

const TOKEN_KEY = 'token';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
    // Reload the token from localstorage if possible
    const token = this.localStorage.get(TOKEN_KEY);
    if (token) {
      this._token.next(token);
    }
  }

  private _token: Subject<string> = new BehaviorSubject('');

  public get token(): Observable<string> {
    return this._token.asObservable();
  }

  public get authenticated(): Observable<boolean> {
    return this._token.map(token => !!token);
  }

  public get httpHeader(): Observable<HttpHeaders> {
    return this.token.take(1)
      .map(token => {
        let headers = new HttpHeaders();
        return headers.set('Authorization', 'Bearer ' + token);
      });
  }

  public login(username: string, password: string, rememberMe: boolean): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('/api/auth/login', {
      username, password, rememberMe,
    })
      .do(response => {
        const token = response.token;
        if (token) {
          this._token.next(token);
          if (rememberMe) {
            this.localStorage.set(TOKEN_KEY, token);
          }
        }
      });
  }

  public logout() {
    this._token.next('');
    this.localStorage.remove(TOKEN_KEY);
  }
}
