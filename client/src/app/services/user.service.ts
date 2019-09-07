import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  login(email: string, password: string): Observable<any>{
    return this.http.post('/api/login',{
      email,
      password
    });
 }

 register( email: string,password: string): Observable<any> {
   return this.http.post('/api/register', {
    email, 
    password
   })
 }

forgotPassword(email:string): Observable<any>{
  return this.http.post('/api/user/forgot_password',{
    email
  });
}
getAccountDetails(email:string): Observable<any>{
  return this.http.post('/api/getAccountDetails',{
    email
  });
}
sendEther(email:string, reciepient:string, amount:string): Observable<any>{
  return this.http.post('/api/sendEther',{
      email,
      reciepient,
      amount
  })
}
deposit(email:string): Observable<any>{
  return this.http.post('/api/deposit',{
      email
  });
}
}
