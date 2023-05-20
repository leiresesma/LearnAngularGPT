import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class User {
  isLogged: boolean = false; // Define your shared variable here

  constructor() { }
}
