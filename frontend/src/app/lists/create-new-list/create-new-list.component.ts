import {Component, OnInit} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {ListsService} from '../../services/lists.service';

@Component({
  selector: 'app-create-new-list',
  templateUrl: './create-new-list.component.html',
  styleUrls: ['./create-new-list.component.scss'],
})
export class CreateNewListComponent implements OnInit {

  public name = '';
  public error = '';

  constructor(private dialogRef: MdDialogRef<CreateNewListComponent>, private listsService: ListsService) {
  }

  ngOnInit() {
  }

  public createNewList() {
    this.listsService.createNewList(this.name)
      .subscribe(response => {
        this.dialogRef.close(response);
      }, error => {
        this.error = error;
      });
  }

}
