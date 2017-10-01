import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdDialogModule,
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
import {LoginComponent} from './login/login.component';
import {ServicesModule} from './services/services.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListsComponent,
    CreateNewListComponent,
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
    routes,
    BrowserAnimationsModule,
    ServicesModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateNewListComponent,
  ],
})
export class AppModule { }
