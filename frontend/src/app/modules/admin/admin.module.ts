// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Auth routing.
import { AdminRoutingModule } from './admin-routing.module';

// Core
import { CoreModule } from '../core/core.module';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AdminRoutingModule,
    ],
    declarations: [
    ]
})
export class AdminModule { }
