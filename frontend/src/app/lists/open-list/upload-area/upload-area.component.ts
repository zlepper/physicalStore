import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-upload-area',
  templateUrl: './upload-area.component.html',
  styleUrls: ['./upload-area.component.scss'],
})
export class UploadAreaComponent implements OnInit {

  @Output()
  public upload = new EventEmitter<File[]>();

  constructor() {
  }

  ngOnInit() {
  }

  public uploadFiles(event: DragEvent) {
    event.preventDefault();
    const dt = event.dataTransfer;
    const files = <File[]>(dt.items ? Array.from(dt.items).map(item => item.getAsFile()) : Array.from(dt.files));

    this.upload.emit(files);
  }

  public selectFiles(files: File[]) {
    this.upload.emit(Array.from(files));
  }

}
