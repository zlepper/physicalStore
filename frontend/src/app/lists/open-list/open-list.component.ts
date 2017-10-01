import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/combineLatest';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {IPost, IUploadablePost} from '../../models/post';
import '../../operators/behaviorSubject';
import {ListsService} from '../../services/lists.service';
import {UploadService} from '../../services/upload.service';

@Component({
  selector: 'app-open-list',
  templateUrl: './open-list.component.html',
  styleUrls: ['./open-list.component.scss'],
})
export class OpenListComponent implements OnInit {

  public posts: Observable<IPost[]>;
  public searchField = new FormControl('');
  private listId: Observable<string>;
  private _posts: Subject<IUploadablePost[]> = new Subject();

  constructor(private route: ActivatedRoute, private listsService: ListsService, private uploadService: UploadService) {
  }

  ngOnInit() {
    this.posts = this._posts
      .combineLatest(this.searchField.valueChanges.behaviorSubject(''))
      .map(([posts, searchText]) => posts.filter(post => post.name.toLowerCase().includes(searchText)))
      .map(posts => posts.reverse());

    this.listId = this.route.params.map(params => params.id);

    this.listId.subscribe(() => this.refresh());
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

  public uploadFilesToPost(files: File[], post: IPost) {
    this.listId.take(1)
      .subscribe(listId => files.forEach(file => this.uploadService.addFileToPost(post, file, listId)));
  }

  private refresh() {
    this.listId.take(1)
      .switchMap(listId => this.listsService.getPosts(listId))
      .combineLatest(this.uploadService.uploadTasks)
      .map(([posts, uploadTasks]) => <IUploadablePost[]>posts.map(post => ({
        ...post,
        uploadTasks: uploadTasks.filter(task => task.post.id == post.id),
      })))
      .subscribe(posts => this._posts.next(posts));
  }
}
