import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User;

  constructor(private userService: UserService,
    private router: Router) { 
    if(null==this.user){
      this.user = new User();
    }
  }

  ngOnInit() {
  }

  register() {
    if(!this.validatePassword()){
      alert("Passwords do not match.");
      return;
    }
    console.log(this.user);
    this.userService.createUser(this.user);
    alert("User created successfully.");
    this.router.navigate(["/login"]);
  }

  validatePassword(){
    return this.user.password === this.user.repeatPassword;
  }

}
