import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PasswordValidator, ParentErrorStateMatcher } from '../../validators/passwordValidator';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userDetailsForm: FormGroup;
  matching_passwords_group: FormGroup;
  accountDetailsForm: FormGroup;
  parentErrorStateMatcher = new ParentErrorStateMatcher();
  public errorMessage:string=''
  public loading: boolean = false;
  account_validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 5 characters long' },
    ]
    
  }

  constructor( private userService: UserService, private router : Router, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.createForms();

  }

  createForms(){
    // matching passwords validation
    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });
    // user links form validations
    this.accountDetailsForm = this.fb.group({ 
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[A-Za-z+-.%0-9]+\@[A-Za-z]+\.[A-Za-z]{2,63}$')
      ])),
      matching_passwords: this.matching_passwords_group,
    })
  }

  register(value){
    this.loading = true;
    let email = value.email;
    let password = value.matching_passwords.password
    //send registeration info to userService
    this.userService.register(email,password)
    .subscribe((resp) => {
      console.log("registering");

      this.openSnackBar('Succesfully registered');
      console.log('Successfully registered '+resp.msg);
      //redirect to login page
      this.loading= false;
      this.router.navigate(['user','login']);
    }, (err) => {
      this.loading = false;
       this.errorMessage= err.error.msg;
       console.log(err);
      //store error in message variable
    });
  }
  openSnackBar(message: string){
    this.snackBar.open(message,null,{
      duration:2000
    });
  }
}
