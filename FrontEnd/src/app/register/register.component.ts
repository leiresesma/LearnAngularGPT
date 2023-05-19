import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: FormGroup;

  constructor(private formBuilder : FormBuilder, private http: HttpClient, private router : Router) {}

  ngOnInit() : void {
    this.form = this.formBuilder.group({
      "email" : '',
      "name" : '',
      "surname" : '',
      "password" : '',
      "rpassword" : ''
    })
  };

  register () : void {
    this.http.post("http://localhost:3000/register", this.form.getRawValue()).subscribe((res : any) => {
      console.log(res);
      this.router.navigate(['/']);
    })
  }
}