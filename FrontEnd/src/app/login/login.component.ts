import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;

  constructor(private formBuilder : FormBuilder, private router: Router, private http: HttpClient) {}

  ngOnInit() : void {
    this.form = this.formBuilder.group({
      "email" : '',
      "password" : ''
    })
  };

  login() {
    this.http.post('http://localhost:3000/login', this.form.getRawValue(), {
      withCredentials: true
    }).subscribe((res) => {
      console.log(res)
      this.router.navigate(['/home']);
    })
  }
}
