import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from './pages/base/base.component';
import { BhHeaderComponent } from './pages/bh-header/bh-header.component';
import { BhFooterComponent } from './pages/bh-footer/bh-footer.component';
import { RouterModule } from '@angular/router';
import { BloghubLoaderComponent } from './pages/bloghub-loader/bloghub-loader.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileUploaderComponent } from './pages/file-uploader/file-uploader.component';

@NgModule({
  declarations: [
    BaseComponent,
    BhHeaderComponent,
    BhFooterComponent,
    BloghubLoaderComponent,
    FileUploaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule
  ],
  exports: [
    BaseComponent,
    BhHeaderComponent,
    BhFooterComponent,
    BloghubLoaderComponent,
    FileUploaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule { }
