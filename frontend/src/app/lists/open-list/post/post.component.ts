import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MdDialog} from '@angular/material';
import {IPost} from '../../../models/post';
import {PostRemoveConfirmComponent} from './post-remove-confirm/post-remove-confirm.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {

  @Input()
  public post: IPost;

  @Output()
  public deletePost: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  public savePost: EventEmitter<IPost> = new EventEmitter<IPost>();

  public editingPost = false;

  constructor(private dialog: MdDialog) {
  }

  ngOnInit() {
  }

  public removePost() {
    this.dialog.open(PostRemoveConfirmComponent, {
      data: this.post,
    }).afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.deletePost.emit();
      }
    });
  }

  public editPost() {
    this.editingPost = true;
  }

  public cancelEdit() {
    this.editingPost = false;
  }

  public triggerSavePost(post: IPost) {
    console.log('save triggered');
    if (post.creator == this.post.creator && post.id == this.post.id) {
      this.savePost.emit(post);
      this.post = post;
      this.cancelEdit();
    }
  }
}
