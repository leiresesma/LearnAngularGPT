import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email : string = "";
  password : string = "";
  rpassword: string = "";

  constructor(private http: HttpClient) {}

  ngOnInit() : void {

  }

  register () : void {
    let bodyData = {
      "email" : this.email,
      "name" : "Michael",
      "surname" : "Jackson",
      "password" : this.password,
      "rpassword" : this.rpassword
    }

    this.http.post("http://localhost:3000/login", bodyData).subscribe((res : any) => {
      console.log(res);
      alert(res)
    })
  }
}