import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = "";
  password: string = "";

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    let bodyData = {
      email : this.email,
      password : this.password
    };

    this.http.post('http://localhost:3000/salchicha', bodyData).subscribe((res) => {
      this.router.navigateByUrl('/home')
    })
  }
}
