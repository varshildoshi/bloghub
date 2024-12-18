import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
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
    UserRoutingModule,
    FormsModule, ReactiveFormsModule,
    NgbPopoverModule,
    CoreModule
  ]
})
export class UserModule { }
