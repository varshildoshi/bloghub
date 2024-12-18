import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModulesRouting } from './ui-modules-routing.module';
import { CoreModule } from './core/core.module';
import { AuthenticationService } from '../services/authentication.service';
import { TokenStorage } from '../services/token-storage.service';
import { UserService } from '../services/user.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UIModulesRouting,
    CoreModule
  ],
  providers: [
    AuthenticationService,
    TokenStorage,
    UserService,
  ],
  exports: [UIModulesRouting]
})
export class UIModule { }
