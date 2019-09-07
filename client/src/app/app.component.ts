import { Component } from '@angular/core';
import { Router, NavigationEnd, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'arrowWallet';
  public loading:boolean=false;


  constructor(private snackBar: MatSnackBar,private router: Router){}
//open snackbar if user enters professionals list



ngOnInit(){
  this.router.events.subscribe(event => {
    if (event instanceof RouteConfigLoadStart) {
        this.loading = true;
    } else if (event instanceof RouteConfigLoadEnd) {
        this.loading = false;
    }
});
}
}
