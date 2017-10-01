import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {AuthService} from './auth.service';
import {IsAuthenticatedGuard} from './is-authenticated.guard';
import {ListsService} from './lists.service';
import {LocalStorageService} from './local-storage.service';
import {LogPipe} from './log.pipe';
import {UploadService} from './upload.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [
    LogPipe,
  ],
  providers: [
    AuthService,
    IsAuthenticatedGuard,
    LocalStorageService,
    ListsService,
    UploadService,
  ],
  exports: [
    LogPipe,
  ],
})
export class ServicesModule {
}
