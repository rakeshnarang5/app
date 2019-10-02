import { Injectable } from '@angular/core';
import { User } from './models/user.model';
import { LoginDetails } from './models/loginDetails.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  recoverPassword(recoveryDetails: import("./models/recoveryDetails.model").RecoveryDetails) {
    let user = this.findUserByName(recoveryDetails.username);
    console.log(user);
    if(user.length === 0){
      alert("User doesn't exist.");
      return null;
    } 
    console.log("reacher 1")
    console.log("user[0].firstEmployer: "  + user[0].firstEmployer)
    console.log("recoveryDetails.securityAnswer: "+recoveryDetails.securityAnswer)
    console.log(user[0].firstEmployer === recoveryDetails.securityAnswer)
      if(user[0].firstEmployer === recoveryDetails.securityAnswer){
        console.log("reacher 2")
        alert("Password is: " + user[0].password);
        return user[0].password;
      }
    alert("Security answer is incorrect");
    return null;
  }

  allUsers: User[] = [];

  constructor() { }

  createUser(user: User){
    this.allUsers.push(user);
    console.log(this.allUsers);
  }

  login(loginDetails: LoginDetails){
    let user = this.findUserByName(loginDetails.username);
    if(user.length === 0){
      alert("User doesn't exist.");
      return;
    }
    if(user.length >= 1) {
      if(user[0].password !== loginDetails.password){
        alert("Password is incorrect.");
        return null;
      }
      return user[0];
    }
    return null;
  }

  findUserByName(username){
    return this.allUsers.filter(p => p.username === username);
  }
}
