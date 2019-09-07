import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [LoginComponent,RegisterComponent],
  imports: [
    CommonModule,SharedModule,
    UserRoutingModule,MaterialModule
  ]
})
export class UserModule { }
