// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Auth routing.
import { AdminRoutingModule } from './admin-routing.module';

// Shared
// import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';


@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        // SharedModule,
        AdminRoutingModule,
    ],
    declarations: [
    ]
})
export class BlogHubAdminModule { }
