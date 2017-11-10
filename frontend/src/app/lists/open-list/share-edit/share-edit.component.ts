import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatChipInputEvent, MatDialogRef} from '@angular/material';
import 'rxjs/add/operator/zip';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {IUser} from '../../../models/editor';
import {IList} from '../../../models/list';
import {EditorService} from '../../../services/editor.service';
import {ListsService} from '../../../services/lists.service';

@Component({
  selector: 'app-share-edit',
  templateUrl: './share-edit.component.html',
  styleUrls: ['./share-edit.component.scss'],
})
export class ShareEditComponent implements OnInit {

  public listName: string;
  public editors: Subject<IUser[]>;
  public accessors: Subject<IUser[]>;

  constructor(@Inject(MAT_DIALOG_DATA) private data: IList,
              private dialogRef: MatDialogRef<ShareEditComponent>,
              private editorService: EditorService,
              private listsService: ListsService) {
  }

  ngOnInit() {
    this.listName = this.data.name;
    this.editors = new BehaviorSubject([]);
    this.accessors = new BehaviorSubject([]);

    this.editorService.getEditors(this.data.id)
      .subscribe(editors => this.editors.next(editors));

    this.editorService.getAccessors(this.data.id)
      .subscribe(accessors => this.accessors.next(accessors));

  }

  public removeEditor(editor: IUser) {
    this.editors.take(1)
      .subscribe(editors => this.editors.next(editors.filter(ed => ed !== editor)));
  }

  public addEditor(event: MatChipInputEvent) {
    const input = event.input;
    const username = (event.value || '').trim();

    if (!username) return;

    this.editorService.getUser(username)
      .zip(this.editors.take(1))
      .subscribe(([editor, editors]) => this.editors.next([...editors, editor]));

    if (input) {
      input.value = '';
    }
  }
}
