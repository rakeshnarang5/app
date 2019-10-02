import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { RecoveryDetails } from '../models/recoveryDetails.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  recoveryDetails: RecoveryDetails;

  constructor(private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.recoveryDetails = new RecoveryDetails();
  }

  recover(){
    let password = this.userService.recoverPassword(this.recoveryDetails);
    if(null == password){
      return;
    }
    this.router.navigate(["/login"]);
  }

}
