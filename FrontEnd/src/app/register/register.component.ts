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
  showError: boolean;
  errorMsg: string;

  constructor(private formBuilder : FormBuilder, private http: HttpClient, private router : Router) {
    this.showError = false;
    this.errorMsg = "";
  }

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
    this.http.post("http://localhost:3000/register", this.form.getRawValue()).subscribe({
      next: (res : any) => {
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.showError = true;
        this.errorMsg = e.error.msg;
        console.log(e.error.msg)
      }
    })
  }
}