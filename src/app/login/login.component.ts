import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
    public username: string | undefined;

    constructor(
        private router: Router
    ) {}

    ngOnInit() {
        // if(localStorage.getItem('username')) {
        //     this.router.navigate(['/game']);
        // }
    }
  
    login() {
      if (this.username) {
        // Store the username in localStorage
        localStorage.setItem('username', this.username);
  
        // You can navigate to another page or perform other actions here
        // For example, redirect to a dashboard:
        this.router.navigate(['/game']);
      }
    }
}

// todo fix capture into check bug
