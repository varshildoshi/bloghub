import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAuthorizationGuardService } from './core/guards/login-authorization-guard-service';
import { BaseComponent } from './core/pages/base/base.component';
import { AuthorizationGuardService } from './core/guards/authorization-guard-service';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: '',
    children: [
      {
        path: '',
        component: BaseComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
            canActivate: [LoginAuthorizationGuardService],
          },
          {
            path: 'blogs',
            loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
            canActivate: [AuthorizationGuardService],
          },
          {
            path: 'user',
            loadChildren: () => import('./user/user.module').then(m => m.UserModule),
            canActivate: [AuthorizationGuardService],
          },
        ]
      }
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class UIModulesRouting { }
