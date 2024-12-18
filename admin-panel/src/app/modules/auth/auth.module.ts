// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {StripeCheckoutModule} from 'ng-stripe-checkout';

// Auth routing.
import { AuthRoutingModule } from './auth-routing.module';

// Comman layout.
import { AuthLayoutComponent } from './pages/auth-layout/auth-layout.component';

// Components.
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

// Core
import { CoreModule } from '../core/core.module';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CoreModule,
        ReactiveFormsModule,
        // StripeCheckoutModule,
        AuthRoutingModule,
    ],
    declarations: [
        AuthLayoutComponent,
        LoginComponent,
        RegisterComponent,
        VerifyEmailComponent,
        ResetPasswordComponent,
    ]
})
export class AuthModule { }
