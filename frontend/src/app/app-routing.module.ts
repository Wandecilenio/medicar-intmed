import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { IsLoggedGuard } from './guards/is-logged.guard';
import { SkipLoginGuard } from './guards/skip-login.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app'
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [ SkipLoginGuard ]
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [ SkipLoginGuard ]
  },
  {
    path: 'app',
    component: MainPageComponent,
    canActivate: [ IsLoggedGuard ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
