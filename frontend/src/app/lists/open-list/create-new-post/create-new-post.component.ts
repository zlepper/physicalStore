import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-create-new-post',
  templateUrl: './create-new-post.component.html',
  styleUrls: ['./create-new-post.component.scss'],
})
export class CreateNewPostComponent implements OnInit {

  @Output()
  public newPost: EventEmitter<string> = new EventEmitter<string>();

  public name: string = '';

  constructor() {
  }

  ngOnInit() {
  }

  public createPost() {
    this.newPost.emit(this.name);
    this.reset();
  }

  private reset() {
    this.name = '';
  }
}
