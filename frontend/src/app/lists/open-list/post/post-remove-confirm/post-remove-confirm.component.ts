import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {IPost} from '../../../../models/post';

@Component({
  selector: 'app-post-remove-confirm',
  templateUrl: './post-remove-confirm.component.html',
  styleUrls: ['./post-remove-confirm.component.scss'],
})
export class PostRemoveConfirmComponent implements OnInit {

  constructor(private dialogRef: MdDialogRef<PostRemoveConfirmComponent>, @Inject(MD_DIALOG_DATA) public data: IPost) {
  }

  ngOnInit() {
  }

}
