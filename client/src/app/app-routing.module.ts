import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/user/user.module#UserModule', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},

  {
    path: 'user',
    loadChildren: './user/user.module#UserModule'
  }
  
  //{path:'user/login', component: LoginComponent},
  //{path: 'user/register', component: RegisterComponent},
//  {path: 'professionals/:category', component: ProfessionalsListComponent, resolve: {category: ProfessionalsCategoryResolverService}},
 // {path: 'professionals', component: ProfessionalsListComponent},
  //{path: 'professional/:id', component: ProfessionalDetailsComponent, resolve: {professional: ProfessionalLoadResolverService}},


//  {path: 'me', component:ProfileComponent, canActivate: [AuthGuard]}
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],

   providers:  [{provide: APP_BASE_HREF, useValue: '/'}],
  exports: [RouterModule]
})
export class AppRoutingModule { }
