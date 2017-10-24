import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';
import {IFullList, IList} from '../models/list';
import {IPost} from '../models/post';
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
      .switchMap(headers => this.http.post<IList>('/api/lists/', {name}, {headers}));
  }

  public getPosts(listId: string): Observable<IPost[]> {
    return this.auth.httpHeader
      .switchMap(headers => this.http.get<IFullList>(`/api/lists/${listId}`, {headers}))
      .map(list => list.posts);
  }

  public createPost(name: string, listId: string): Observable<void> {
    return this.auth.httpHeader
      .switchMap(headers => this.http.post(`/api/lists/${listId}/posts/`, {name}, {headers}))
      .map(() => undefined);
  }

  public deletePost(postId: string, listId: string): Observable<void> {
    return this.auth.httpHeader
      .switchMap(headers => this.http.delete(`/api/lists/${listId}/posts/${postId}`, {headers}))
      .map(() => undefined);
  }

  public updatePost(post: IPost, listId: string): Observable<void> {
    return this.auth.httpHeader
      .switchMap(headers => this.http.put(`/api/lists/${listId}/posts/${post.id}`, post, {headers}))
      .map(() => undefined);
  }

  public deleteList(id: string): Observable<void> {
    return this.auth.httpHeader
      .switchMap(headers => this.http.delete(`/api/lists/${id}`, {headers, responseType: 'text'}))
      .map(() => undefined);
  }

  public getList(id: string): Observable<IList> {
    return this.auth.httpHeader
      .switchMap(headers => this.http.get<IList>(`/api/lists/${id}`, {headers}));
  }
}
