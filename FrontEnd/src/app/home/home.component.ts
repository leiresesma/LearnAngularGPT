import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitters } from '../emitters/emitters';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  welcome : string = "You are not logged in.";
  authenticated : boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() : void {
    //The emiter doesn't do nothing right now, but if needed you can copy it and call the logout event elsewhere.
    Emitters.authEmitter.subscribe(
      (auth : boolean) => {
        this.authenticated = auth;
      }
    );

    this.http.get("http://localhost:3000/", {
      withCredentials: true
    }).subscribe({
      next: (res : any) => {
        console.log(res);
        this.welcome = 'Hola, ' + res.user.name + " " + res.user.surname + ".";
        Emitters.authEmitter.emit(true);
      },
      error: (e) => {
        console.error(e);
        Emitters.authEmitter.emit(false);
      }
    });
  }

  logout() : void {
    this.http.get('http://localhost:3000/logout', {
      withCredentials: true
    }).subscribe((res) => {
      this.authenticated = false;
      console.log(res);
      this.router.navigate(['/']);
    })
  }
}