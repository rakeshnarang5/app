import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDetails } from '../models/loginDetails.model';
import { UserService } from '../user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginDetails: LoginDetails;

  constructor(private router: Router,
    private userService: UserService) { 
    
  }

  ngOnInit() {
    this.loginDetails = new LoginDetails();
  }

  register(){
    console.log("register called")
    this.router.navigate(['/register']);
  }

  login(){
    let user = this.userService.login(this.loginDetails);
    if(user == null){
      return;
    }
    this.router.navigate(["/home"]);
  }

  forgotPassword(){
    this.router.navigate(["/forgot-password"]);
  }

}
