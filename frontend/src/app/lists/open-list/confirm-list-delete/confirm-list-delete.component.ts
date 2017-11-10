import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {IList} from '../../../models/list';

@Component({
  selector: 'app-confirm-list-delete',
  templateUrl: './confirm-list-delete.component.html',
  styleUrls: ['./confirm-list-delete.component.scss'],
})
export class ConfirmListDeleteComponent implements OnInit {

  public listName: string;
  public confirmListName: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: IList, private dialogRef: MatDialogRef<ConfirmListDeleteComponent>) {
  }

  ngOnInit() {
    this.listName = this.data.name;
    console.log(this);
  }

  public confirmDelete() {
    this.dialogRef.close(this.data.id);
  }

}
