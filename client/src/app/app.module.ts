import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { UserStoreService } from './services/user-store.service';
import { UserService } from './services/user.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './home/home.component';
import {FormsModule} from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,AppRoutingModule,BrowserAnimationsModule, MaterialModule,FormsModule
  ],
  providers: [UserService,UserStoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
