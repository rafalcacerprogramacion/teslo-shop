import { Routes } from "@angular/router";
import { AuthLayout } from "@authlayout/auth-layout/auth-layout";
import { LoginPageComponent } from "@authpages/login-page/login-page";
import { RegisterPage } from "@authpages/register-page/register-page";

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children : [
      {
        path: 'login',
        component: LoginPageComponent
      },
      {
        path: 'register',
        component: RegisterPage
      },
      {
        path: '**',
        redirectTo: 'login'
      },
    ]
  }
]

export default authRoutes;