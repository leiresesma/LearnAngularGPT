import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitters } from '../emitters/emitters';
import { Router } from '@angular/router';
import config from '../../../../config.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  welcome : string = "You are not logged in.";
  authenticated : boolean = false;
  selectedAnswer : string= "";
  questionOptions : any[];
  question : string;
  result : string;
  show: boolean;
  dropdown: string;
  dropDownMenuOptions: any;
  pachuli : string = "null";
  preguntas :any;
  questionObject : any;
  options : any;
  resultType : string;
  message : boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() : void {
    Emitters.authEmitter.subscribe(
      (auth : boolean) => {
        this.authenticated = auth;
      }
    );

    this.http.get(config['BACK_END-URL'], {
      withCredentials: true
    }).subscribe({
      next: (res : any) => {
        console.log(res);
        this.welcome = 'Hello, ' + res.name + " " + res.surname + ".";
        this.preguntas= res.questions
        this.generateQuestion();
        Emitters.authEmitter.emit(true);
      },
      error: (e) => {
        console.error(e);
        Emitters.authEmitter.emit(false);
      }
    });
    
  } 
  
  next() : void {
    //Select random question:
    let numQuestions : number = this.preguntas.length;
    this.message = false;
    this.result = "";   
    let questionIndex = Math.floor(Math.random() * numQuestions);
    this.loadQuestions(questionIndex)
  }

  reload() : void {
    location.reload()
  }

  generateQuestion() : void {
    this.loadQuestions(this.preguntas.length - 1)
  }

  loadQuestions(index : number) : void {
    this.message = false;    
    this.questionObject = this.preguntas[index];
    this.question = this.preguntas[index].question;

    switch (this.questionObject.qType) {
      case "Binary":
        this.show = true;
        this.questionOptions = [{
          "text" : "True",
          "value" : "True"
        },
      {
        "text" : "False",
        "value" : "False"
      }];
        break;
      case "MultipleChoice":
        this.show = true;
        this.options = this.questionObject.options;
        console.log(this.options)
        this.questionOptions  = [{
          "text": this.options.a,
          "value": "A"
        },
        {
          "text": this.options.b,
          "value": "B"
        },
        {
          "text": this.options.c,
          "value": "C"
        },
        {
          "text": this.options.d,
          "value": "D"
        }
      ];
        break;
      /*case "DropDown":
        this.show = false;
        this.dropdown = this.questionObject.dropDown;
        options = this.questionObject.options;
        this.dropDownMenuOptions = options;
        console.log("hola")
        break;*/
      case "Input":
        this.show = false;
        console.log(this.selectedAnswer)
        break;
    }
  }  
  
  test () : void {
    console.log(this.selectedAnswer + this.questionObject.answer)
    this.message = true;
    if (this.show==true){
        if(this.selectedAnswer == this.questionObject.answer){
      this.resultType = "alert-success"
      this.result = "Correct!"
      }else{
      this.resultType = "alert-danger"
      this.result = "Incorrect."
      }
    }else{
      let userAnswer={
        "questionUserInput" : this.question,
        "givenAnswer": this.selectedAnswer
      }
      console.log(userAnswer)
      
      this.http.post(config['BACK_END-URL'] + "/response", userAnswer,{
        withCredentials: true
      }).subscribe({
        next: (res : any) => {
          
          console.log(res)
          if(res.response=='True'){
          this.resultType = "alert-success"
          this.result = "Correct!"
        }else{
          this.resultType = "alert-danger"
          this.result = res.explanation
        }
        },
        error: (e) => {
          alert(e.error.msg);
        }
      })

    }
  
  }

  logout() : void {
    this.http.get(config['BACK_END-URL'] + '/logout', {
      withCredentials: true
    }).subscribe((res) => {
      Emitters.authEmitter.emit(false);
      console.log(res);
      this.router.navigate(['/']);
    })
  }
}