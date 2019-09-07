import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  private _token: string = null;
  private _email:string = '';
  private _password: string= '';
  constructor() { }


  set token(token: string) {
    this._token = token;
  }

  get token() {
    return this._token;
  }


  get email(){
    return this._email;
  }

  set email(email:string){
    this._email = email;
  }

  get password(){
    return this._password;
  }

  set password(password:string){
    this._password = password;
  }

  
  isLoggedIn() {
    return this.token != null;
  }
}
