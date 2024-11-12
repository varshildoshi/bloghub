// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layout
import { AuthLayoutComponent } from './pages/auth-layout/auth-layout.component';

// Child
import { LoginComponent } from './pages/login/login.component';
import { AuthNoticeComponent } from './pages/auth-notice/auth-notice.component';
import { RegisterComponent } from './pages/register/register.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';


const routes: Routes = [
    {
        path: '', component: AuthLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'verify-email', component: VerifyEmailComponent },
            { path: '', pathMatch: 'full', redirectTo: 'login' }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
