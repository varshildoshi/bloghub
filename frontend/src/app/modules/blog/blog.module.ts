import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { AllBlogsComponent } from './pages/all-blogs/all-blogs.component';


@NgModule({
  declarations: [
    AllBlogsComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
