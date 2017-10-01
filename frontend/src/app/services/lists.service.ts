import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';
import {ICreatedList, IList} from '../models/list';
import {AuthService} from './auth.service';

@Injectable()
export class ListsService {

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  public getAllLists(): Observable<IList[]> {
    return this.auth.httpHeader
      .switchMap(headers => this.http.get<IList[]>('/api/lists/', {headers}));
  }

  public createNewList(name: string): Observable<IList> {
    return this.auth.httpHeader
      .switchMap(headers => this.http.post<ICreatedList>('/api/lists/', {name}, {headers}));
  }

}
