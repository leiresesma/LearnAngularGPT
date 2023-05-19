import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: FormGroup;

  constructor(private formBuilder : FormBuilder, private http: HttpClient) {}

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
    /*
    this.http.post("http://localhost:3000/login", bodyData).subscribe((res : any) => {
      console.log(res);
      alert(res)
    })*/
    console.log(this.form.getRawValue());
  }
}