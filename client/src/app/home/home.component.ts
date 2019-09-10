import { Component, OnInit } from '@angular/core';
import { UserStoreService } from '../services/user-store.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Transaction } from '../models/transaction';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
   public sendEther: boolean = false;
   public address:string = "";
   public amount:number;
   public sendAmount:number;
   public reciepient:string ="";
   public transactions: Transaction[]= [];
   public allowedNoDeposit: number = 3;
  constructor(private userStore : UserStoreService, private userService: UserService,private router : Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    if(this.userStore.email){
      this.userService.getAccountDetails(this.userStore.email).subscribe((resp)=>{
        console.log(resp);
        this.address = resp.address;
        this.amount = resp.balance;

      })
    }
    else{
      this.router.navigate(['user','login']);
    }
  }
  sendToggle(){
    this.sendEther = !(this.sendEther);
    console.log("toggleing")
  }
   sendEtherTo(){
     if(this.reciepient && this.sendAmount && (this.amount - this.sendAmount) >= 0){
       console.log(this.userStore.email);
       console.log(this.reciepient);
       console.log(this.sendAmount);
       this.userService.sendEther(this.userStore.email,this.reciepient,this.sendAmount.toString()).subscribe((resp)=>{
         if(resp.hash){
            let trans = {reciepient: this.reciepient, amount:this.sendAmount.toString(),hash: resp.hash};
            this.transactions.push(trans);
            console.log(this.transactions);
            this.amount -= this.sendAmount;
         }
         else{
          this.openSnackBar("cant send ether");

         }
       })
     }
     else {
       this.openSnackBar("you dont have enough ether");

     }
   }
   deposit(){
     if(this.allowedNoDeposit >= 0){
     this.userService.deposit(this.userStore.email).subscribe((resp) =>{
      if (resp.hash){
      this.amount = parseFloat(this.amount.toString()) + 10 ;

      console.log(typeof(this.amount));
      this.allowedNoDeposit  -= 1;
      let trans = {reciepient: this.address, amount:"10",hash: resp.hash};
      this.transactions.push(trans);
      this.openSnackBar("10 ether deposited in your acocunt");
      
      }
      else {
        console.log(resp)
        this.openSnackBar("no more ether");
      }
    
     });
    }
    else{
      this.openSnackBar("Allowed deposit limit reached for thi session");
    }
   }

   openSnackBar(message: string){
    this.snackBar.open(message,null,{
      duration:2000
    });
}
}