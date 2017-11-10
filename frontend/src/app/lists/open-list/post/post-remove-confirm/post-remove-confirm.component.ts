import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {IPost} from '../../../../models/post';

@Component({
  selector: 'app-post-remove-confirm',
  templateUrl: './post-remove-confirm.component.html',
  styleUrls: ['./post-remove-confirm.component.scss'],
})
export class PostRemoveConfirmComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PostRemoveConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: IPost) {
  }

  ngOnInit() {
  }

}
