import {HttpClient} from '@angular/common/http';
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
  MdSelectModule,
  MdToolbarModule,
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {AppComponent} from './app.component';
import {routes} from './app.routing';
import {CreateNewListComponent} from './lists/create-new-list/create-new-list.component';
import {ListsComponent} from './lists/lists.component';
import {ConfirmListDeleteComponent} from './lists/open-list/confirm-list-delete/confirm-list-delete.component';
import {ValueMatchValidator} from './lists/open-list/confirm-list-delete/ValueValidator';
import {CreateNewPostComponent} from './lists/open-list/create-new-post/create-new-post.component';
import {OpenListComponent} from './lists/open-list/open-list.component';
import {EditPostComponent} from './lists/open-list/post/edit-post/edit-post.component';
import {PostRemoveConfirmComponent} from './lists/open-list/post/post-remove-confirm/post-remove-confirm.component';
import {PostComponent} from './lists/open-list/post/post.component';
import {UploadAreaComponent} from './lists/open-list/upload-area/upload-area.component';
import {LoginComponent} from './login/login.component';
import {ServicesModule} from './services/services.module';
import {LanguageSelectorComponent} from './settings/language-selector/language-selector.component';
import {SettingsComponent} from './settings/settings.component';
import {RepeatValidator} from './sign-up/repeatValidator';
import {SignUpComponent} from './sign-up/sign-up.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    SignUpComponent,
    RepeatValidator,
    ConfirmListDeleteComponent,
    ValueMatchValidator,
    LanguageSelectorComponent,
    SettingsComponent,
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
    MdSelectModule,
    routes,
    BrowserAnimationsModule,
    ServicesModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateNewListComponent,
    PostRemoveConfirmComponent,
    ConfirmListDeleteComponent,
  ],
})
export class AppModule {
}
