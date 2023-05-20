import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../domain/User';
import config from '../../../../config.json';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  showError: boolean;
  errorMsg: string;

  constructor(private formBuilder : FormBuilder, private router: Router, private http: HttpClient, private user : User) {
    this.showError = false;
    this.errorMsg = "";
  }

  ngOnInit() : void {
    this.form = this.formBuilder.group({
      "email" : '',
      "password" : ''
    });
  }

  login() {
    this.http.post(config['BACK_END-URL'] + '/login', this.form.getRawValue(), {
      withCredentials: true
    }).subscribe((res : any) => {
      if (res.hasOwnProperty("error")) {
        this.showError = true;
        this.errorMsg = res.error;
      }
      else {
        this.user.isLogged = true;
        this.router.navigate(['/home']);
      }
    });
  }
}
