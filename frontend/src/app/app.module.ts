import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdDialogModule,
  MdExpansionModule,
  MdIconModule,
  MdInputModule,
  MdProgressSpinnerModule,
  MdToolbarModule,
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {routes} from './app.routing';
import {CreateNewListComponent} from './lists/create-new-list/create-new-list.component';
import {ListsComponent} from './lists/lists.component';
import {CreateNewPostComponent} from './lists/open-list/create-new-post/create-new-post.component';
import {OpenListComponent} from './lists/open-list/open-list.component';
import {EditPostComponent} from './lists/open-list/post/edit-post/edit-post.component';
import {PostRemoveConfirmComponent} from './lists/open-list/post/post-remove-confirm/post-remove-confirm.component';
import {PostComponent} from './lists/open-list/post/post.component';
import {UploadAreaComponent} from './lists/open-list/upload-area/upload-area.component';
import {LoginComponent} from './login/login.component';
import {ServicesModule} from './services/services.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListsComponent,
    CreateNewListComponent,
    OpenListComponent,
    CreateNewPostComponent,
    PostComponent,
    PostRemoveConfirmComponent,
    EditPostComponent,
    UploadAreaComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MdToolbarModule,
    MdInputModule,
    MdCheckboxModule,
    MdButtonModule,
    MdProgressSpinnerModule,
    MdCardModule,
    MdDialogModule,
    MdExpansionModule,
    MdIconModule,
    routes,
    BrowserAnimationsModule,
    ServicesModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateNewListComponent,
    PostRemoveConfirmComponent,
  ],
})
export class AppModule {
}
