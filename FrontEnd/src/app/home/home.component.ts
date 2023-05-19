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
  selectedAnswer : string= "";
  questionOptions : string[];
  question : string;
  result : string;
  questionIndex : number;
  questionObject : any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() : void {
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

    this.loadQuestions();
  }

   user= {
      "email" : "leire@gmail.com",
      "name" : "req.body.name",
      "surname" : "req.body.surname",
      "password" : "hashedPassword",
      "level" : 1,
      "questions" : [
        {
          "question" : "You'll learn Angular with this application?",
          "qType" : "Binary", 
          "answer" : "True"
        },
        {
          "question" : "Is working?",
          "qType" : "Binary", 
          "answer" : "False"
        },
        {
          "question" : "My name is Leire?",
          "qType" : "Binary", 
          "answer" : "True"
        },
        {
          "question" : "Is this funny?",
          "qType" : "Binary", 
          "answer" : "False"
        },
        {
          "question" : "Where is my dog?",
          "qType" : "MultipleChoice", 
          "answer" : "My kitchen",
          "options": 
            {
              "a": "My room",
              "b": "My garden",
              "c" : "My kitchen",
              "d" : "I don' have a dog"
            }          
        },
        {
          "question" : "Cual es el tipo correcto de dato para la siguiente declaración de variable?",
          "qType" : "DropDown",
          "answer" : "string[]",
          "dropDown" : "questionOptions : <?> = ['a', 'b', 'c'];",
          "options" :
            {
              "a" : "string",
              "b" : "HashMap<character>",
              "c" : "string[]",
              "d" : "character[]"
            }
        }
      ]
    }

  
  
  
  loadQuestions() : void {
    //Select random question:
    let numQuestions : number = this.user.questions.length;
    console.log(numQuestions)

    this.questionIndex = Math.floor(Math.random() * numQuestions);
    this.questionObject = this.user.questions[this.questionIndex];
    this.question = this.user.questions[this.questionIndex].question;

    switch (this.questionObject.qType) {
      case "Binary":
        this.questionOptions = ['True', 'False'];
        break;
      case "MultipleChoice":
        let options = this.questionObject.options;
        this.questionOptions = [options.a, options.b, options.c, options.d];
        break;
    }
  }  
  
  comprobar () : void {
    if(this.selectedAnswer == this.questionObject.answer){
      this.result = "Correct!"
    }else{
      this.result = "Incorrect."
    }
  }
  
  nextQuestion () : void{
   location.reload();
  }

  logout() : void {
    this.http.get('http://localhost:3000/logout', {
      withCredentials: true
    }).subscribe((res) => {
      Emitters.authEmitter.emit(false);
      console.log(res);
      this.router.navigate(['/']);
    })
  }
}