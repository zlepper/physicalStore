import {Component, OnInit} from '@angular/core';
import {MdDialog} from '@angular/material';
import {Subject} from 'rxjs/Subject';
import {IList} from '../models/list';
import {ListsService} from '../services/lists.service';
import {CreateNewListComponent} from './create-new-list/create-new-list.component';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit {

  public lists: Subject<IList[]>;

  constructor(private listsService: ListsService, private dialog: MdDialog) {
  }

  ngOnInit() {
    this.lists = new Subject();
    this.loadLists();
  }

  public createNewList() {
    this.dialog.open(CreateNewListComponent)
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.loadLists();
        }
      });
  }

  private loadLists() {
    this.listsService.getAllLists()
      .subscribe(lists => this.lists.next(lists));
  }

}
