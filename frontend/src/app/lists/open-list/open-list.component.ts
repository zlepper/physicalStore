import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {IPost} from '../../models/post';
import {ListsService} from '../../services/lists.service';

@Component({
  selector: 'app-open-list',
  templateUrl: './open-list.component.html',
  styleUrls: ['./open-list.component.scss'],
})
export class OpenListComponent implements OnInit {

  public posts: Observable<IPost[]>;
  private _posts: Subject<IPost[]> = new Subject();
  private listId: Observable<string>;

  constructor(private route: ActivatedRoute, private listsService: ListsService) {
  }

  ngOnInit() {
    this.posts = this._posts
      .map(posts => posts.reverse());

    this.listId = this.route.params.map(params => params.id);

    this.listId.switchMap(listId => this.listsService.getPosts(listId))
      .subscribe(posts => {
        this._posts.next(posts);
      });
  }

  public createNewPost(name: string) {
    this.listId.take(1)
      .switchMap(listId => this.listsService.createPost(name, listId))
      .subscribe(() => {
        this.refresh();
      });
  }

  public deletePost(post: IPost) {
    this.listId.take(1)
      .switchMap(listId => this.listsService.deletePost(post.id, listId))
      .subscribe(() => {
        this.refresh();
      });
  }

  public savePost(post: IPost) {
    this.listId.take(1)
      .switchMap(listId => this.listsService.updatePost(post, listId))
      .subscribe(() => undefined, err => {
        console.error(err);
      });
  }

  private refresh() {
    this.listId.take(1).switchMap(listId => this.listsService.getPosts(listId))
      .subscribe(posts => this._posts.next(posts));
  }
}
