import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  selectedAnswer: string= "";
  typeOfAnswer: Array<String> = ['True', 'False'];

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
          "answer" : "c",
          "options": 
            {
              "a": "My room",
              "b": "My garden",
              "c" : "My kitchen",
              "d" : "I don' have a dog"
            }
            
          
        },

      ]
    }

//generar numero random
  randomIndex = [0,1,2,3];
  random = Math.floor(Math.random() * this.randomIndex.length);
  points : number = 0;
  typeQuestion : string = this.user.questions[this.random].qType  
  question: string = this.user.questions[this.random].question;

  answer: string = this.user.questions[this.random].answer;
  response: string = "";
  comprobar () : void{
    if(this.selectedAnswer==this.answer){
      this.response= "Correct!"
      this.points= this.points +1;
      //localStorage.setItem("points", this.points)
      console.log(this.points)
    }else{
      this.response= "Incorrect :("
    }
  }
  
  nextQuestion () : void{
   location.reload();
    
  }

}


