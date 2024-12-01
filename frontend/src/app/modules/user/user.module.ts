import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogHubUserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    UserDashboardComponent,
    MyProfileComponent
  ],
  imports: [
    CommonModule,
    BlogHubUserRoutingModule,
    FormsModule, ReactiveFormsModule,
    NgbPopoverModule,
    CoreModule
  ]
})
export class BlogHubUserModule { }
