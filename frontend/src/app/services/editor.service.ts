import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {IUser} from '../models/editor';
import {AuthService} from './auth.service';

@Injectable()
export class EditorService {

  constructor(private httpClient: HttpClient, private auth: AuthService) {
  }

  public getUser(username: string): Observable<IUser> {
    return this.auth.httpHeader
      .switchMap(headers => this.httpClient.get(`/api/users/${username}`, {headers}));
  }

  public getEditors(listId: string): Observable<IUser[]> {
    return this.auth.httpHeader
      .switchMap(headers => this.httpClient.get<IUser[]>(`/api/lists/${listId}/editors`, {headers}));
  }

  public getAccessors(listId: string): Observable<IUser[]> {
    return this.auth.httpHeader
      .switchMap(headers => this.httpClient.get<IUser[]>(`/api/lists/${listId}/accessors`, {headers}));
  }
}
