import {HttpClient, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Queue} from '../helpers/Queue';
import {IAttachment, IPost} from '../models/post';
import {AuthService} from './auth.service';

export class UploadTask {
  constructor(public post: IPost,
              public file: File,
              public listId: string) {

  }

  private _uploadProgress = new BehaviorSubject<number>(0);

  public get uploadProgress(): Subject<number> {
    return this._uploadProgress;
  }

  private _completed = new BehaviorSubject<boolean>(false);

  public get completed(): Subject<boolean> {
    return this._completed;
  }
}

@Injectable()
export class UploadService {

  private taskQueue: Queue<UploadTask>;

  constructor(private auth: AuthService, private http: HttpClient) {
    this.taskQueue = new Queue<UploadTask>((task, done) => this.upload(task, done));
  }

  private _uploadTasks = new BehaviorSubject<UploadTask[]>([]);

  public get uploadTasks(): Observable<UploadTask[]> {
    return this._uploadTasks.debounceTime(50);
  }

  public addFileToPost(post: IPost, file: File, listId: string): UploadTask {
    const task = new UploadTask(post, file, listId);

    this.taskQueue.add(task);
    this._uploadTasks.next([...this._uploadTasks.getValue(), task]);

    return task;
  }

  private upload(task: UploadTask, done: () => void) {
    const {post, file, listId} = task;
    this.auth.httpHeader
      .switchMap(headers => {

        const data = new FormData();
        data.append('postId', post.id);
        data.append('file', file);

        const req = new HttpRequest('POST', `/api/lists/${listId}/posts/${post.id}/attach`, data, {
          headers,
          reportProgress: true,
        });

        return this.http.request<IAttachment>(req);
      })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            const percentDone = Math.round(100 * event.loaded / event.total);
            task.uploadProgress.next(percentDone);
          }
        } else if (event instanceof HttpResponse) {
          if (event.body) {
            post.attachments.push(event.body);
          }
          task.completed.next(true);
          done();
        }
      });
  }

}
