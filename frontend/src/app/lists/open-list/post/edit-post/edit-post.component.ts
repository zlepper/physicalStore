import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPost} from '../../../../models/post';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {

  @Input()
  public original: IPost;
  public copy: IPost;

  @Output()
  public save: EventEmitter<IPost> = new EventEmitter<IPost>();

  constructor() {
  }

  ngOnInit() {
    this.copy = JSON.parse(JSON.stringify(this.original));
  }

  public triggerSave() {
    this.save.emit(this.copy);
  }

  public reset() {
    this.ngOnInit();
  }

}
