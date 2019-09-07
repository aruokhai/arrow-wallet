import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 
  //variables
  public email: string = '';
  public password: string = '';
  public message: string = '';
  public forget_message = '';
  public loading: boolean = false;
  constructor(private userService: UserService, private router: Router,private userStore: UserStoreService, private snackBar: MatSnackBar) { }

  /* login user */
  login() {
    //console.log(this.userStore.token);
    //check if user is not logged in
    this.loading = true;
    if(this.email != this.userStore.email){
    this.userService.login(this.email, this.password)
      .subscribe((resp) => {
        console.log('Successfully logged in');
        this.userStore.email = this.email;
        console.log(this.email+ "debug email")
        this.userStore.password = this.password;
        this.loading = false;
        this.router.navigate(['home'])
      }, (err) => {
        console.error('Error logging in', err);
        this.message = err.error.msg;
        this.loading = false;
      });
    
  }
  else{
   
    console.log('already logged in');
    this.openSnackBar('you are already logged in');
     this.router.navigate(['home']);
    
  }

}
  ngOnInit() {
  }
  //send an email to the user if ther forgot their password
  async forgotPassword(){
    if(this.email){
         //send email to userService.forgetPassword , so it can send it to the server 
       await   this.userService.forgotPassword(this.email).subscribe((message) =>{
            this.forget_message = message;
          })
         this.openSnackBar('check your email');

    }
    else{
      this.openSnackBar('please put in your email');

    }

  }

  openSnackBar(message: string){
    this.snackBar.open(message,null,{
      duration:2000
    });
  }

}
