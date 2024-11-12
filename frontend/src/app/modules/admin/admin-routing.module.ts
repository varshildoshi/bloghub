// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Base layout component.
import { BaseComponent } from '../core/pages/base/base.component';

// Services
// import { AdminAuthorizationGuardService } from '../core/guards/admin-authorization-guard-service';
// import { AdminLoginAuthorizationGuardService } from '../core/guards/admin-login-authorization-guard-service';


const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./admin-auth/admin-auth.module').then(m => m.AdminAuthModule),
        // canActivate: [AdminLoginAuthorizationGuardService]
    },
    {
        path: '',
        component: BaseComponent,
        children: [
            { 
                path: 'dashboard', 
                loadChildren: () => import('./admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule)
            },
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
        ],
        // canActivate: [AdminAuthorizationGuardService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
