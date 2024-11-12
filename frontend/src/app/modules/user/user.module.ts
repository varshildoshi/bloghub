import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogHubUserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';


@NgModule({
  declarations: [
    UserDashboardComponent
  ],
  imports: [
    CommonModule,
    BlogHubUserRoutingModule
  ]
})
export class BlogHubUserModule { }
