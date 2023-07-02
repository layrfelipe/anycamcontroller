import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  showWarning: boolean;

  constructor(
    private router: Router
  ) {
    this.showWarning = false;
  }

  onSubmit() {
    if (this.loginForm.value.username == "admin" && this.loginForm.value.password == "1234") {
      this.showWarning = false;
      this.router.navigateByUrl("/home");      
    }
    else {
      this.showWarning = true;
      return;
    }
  }
}
