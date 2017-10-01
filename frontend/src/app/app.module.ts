import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdDialogModule,
  MdExpansionModule,
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
    routes,
    BrowserAnimationsModule,
    ServicesModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateNewListComponent,
    PostRemoveConfirmComponent,
  ],
})
export class AppModule { }
