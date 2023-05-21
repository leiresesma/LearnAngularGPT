const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const router = express.Router();
const config = require('../../config.json')
const mongojs = require('mongojs')
const db = mongojs(config['MONGODB-URL'], ['questions', 'users'])
const configuration = new Configuration({
    organization: config.openai.organization,
    apiKey: config.openai.apiKey,
});
const openai = new OpenAIApi(configuration);
const jwt = require('jsonwebtoken')

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user;
  try{
    const cookie = req.cookies['jwt']
    const claims = jwt.verify(cookie, config.jwt.SECRET)

    if(!claims) {
      return res.status(401).send({
        message: 'Unauthenticated'
      })
    }

    await db.users.findOne({"_id": mongojs.ObjectId(claims._id)}, (err, doc) => {
      if (err) {
        res.send({
          message: 'Unauthenticated'
        })
      }
      else {
        user = doc
      }
    })
  }
  catch (error) {
    return res.status(401).send({
      message: 'Unauthenticated'
    })
  }
  
  let questionBinary= "Hello, I want to learn Angular. I need questions to learn from. I've got 5 levels of difficulty from 1 to 5. Being 5 the professional level. I need a single question for the 5 level of difficulty.  The question must be True or False type. This question must be FALSE. I need you to answer me this way. The question between the symbol '%' and the correct answer between '$'. If the answer is True respond $True$ if it's false respond $False$. For example: %Is Angular compatible with node.js?%$True$"
  let questionMultipleChoice= "Hello, I want to learn Angular. I need questions to learn from. I've got 5 levels of difficulty from 1 to 5. Being 5 the professional level. I need a single question for the 5 level of difficulty.  The question must be multiple choice type, from A to D. I need you to answer me this way. The question between the symbol '%' , the choice options between '&' and the correct option between '$'. If the answer is option C respond $C$ .  For example:\
    %Is angular a programming lenguage?% \
    &A. No&\
    & B. Yes &\
    &C. Maybe &\
    &D. Sometimes&\
    $A$"
  let questionInput= "Hello, I want to learn Angular. I need questions to learn from. I've got 5 levels of difficulty from 1 to 5. Being 5 the professional level. I need a single question for the 5 level of difficulty. I only want the question, don't write anythig else. I need you to give me the question between ' %'. For example: %What is angular?%. Then I'll give you my answer and you've got to tell me if it's wrong or right by writing 'True' for true and 'False' for false. If it is false, write me the reason."

  let questionTypes = [
    {
        "questionType" : {
            "type" : "Binary",
            "input" : questionBinary
        }
    },
    {
        "questionType" : {
            "type" : "MultipleChoice",
            "input" : questionMultipleChoice
        }
    },
    {
        "questionType" : {
            "type" : "Input",
            "input" : questionInput
        }
    }
  ] 

  let questionIndex = Math.floor(Math.random() * questionTypes.length);
  const completion = await openai.createChatCompletion({
      model : "gpt-3.5-turbo",
      messages:[
          { 
            role: "user", content: questionTypes[questionIndex].questionType.input,
        }
      ]
  })
  let response = completion.data.choices[0].message.content
  
  let question;
  let answer;
  let options;
  let newQuestion;

  switch (questionTypes[questionIndex].questionType.type) {
    case "Binary":
      question = response.split("%")[1]
      answer = response.split("$")[1]
      newQuestion =  {
        "question" : question,
        "qType" : "Binary", 
        "answer" : answer
      }

      break;
    case "MultipleChoice":
      question= response.split("%")[1]
      answer = response.split("$")[1]
      options= {
        "a": response.split("&")[1].split(".")[1],
        "b": response.split("&")[3].split(".")[1],
        "c" : response.split("&")[5].split(".")[1],
        "d" : response.split("&")[7].split(".")[1]
      } 
      newQuestion =  {
        "question" : question,
        "qType" : "MultipleChoice", 
        "answer" : answer,
        "options": options    
      }
      break;
    case "Input":
      question= response.split("%")[1]
      answer = "N/A"
      newQuestion= {
        "question" : question,
        "qType" : "Input", 
      }
      break;
  }

  db.users.updateOne(
    
    { _id: mongojs.ObjectId(user._id)},
    {
      $push: {
        "questions" : newQuestion
      }
    }
 )
  
 let welcome = {
  "name" : user.name,
  "surname" : user.surname,
  "questions" : user.questions,
  "newQuestion" : newQuestion
 }
 res.send(welcome)
});

module.exports = router;
