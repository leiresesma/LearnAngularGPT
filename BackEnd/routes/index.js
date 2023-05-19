const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const router = express.Router();
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/hads23lab', ['users'])
const configuration = new Configuration({
    organization: "org-IsSnrNvIfWgqfr8SyOuh8y26",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const jwt = require('jsonwebtoken')

/* GET home page. */
router.get('/', async function(req, res, next) {
  try{
    const cookie = req.cookies['jwt']

  const claims = jwt.verify(cookie, 'secret')

  if(!claims) {
    return res.status(401).send({
      message: 'Unauthenticatedy'
    })
  }

  const user = await db.users.findOne({"_id": mongojs.ObjectId(claims._id)}, (err, doc) => {
    if (err) {
      res.send({
        message: "Hello.",
        "cookie": cookie,
        "user": "Not working"
      })
    }
    else {
      console.log(claims._id)
      console.log(doc)
      res.send({"message": "puesbien"})
    }
  })
  }
  catch (error) {
    return res.status(401).send({
      message: 'Unauthenticated'
    })
  }
  

  /* const completion = await openai.createChatCompletion({
      model : "gpt-3.5-turbo",
      messages:[
          { 
            role: "user", content: "Hello, I want to learn Angular. I need questions to learn from. I've got 5 levels of difficulty from 1 to 5. Being 5 the professional level. I need a single question for the 5 level of difficulty. The question must be multiple choice type, from A to D. I need you to answer me this way. The question and the choice options between the symbol '%' and the correct option between '$'. If the answer is option C respond $C$. For example: %Which of the following statements about Angular Ivy is true?%%A. Angular Ivy is a server-side rendering engine that improves the performance of Angular applications.%%B. Angular Ivy is a tool that simplifies the process of creating and deploying Angular applications.%%C. Angular Ivy is a new rendering engine for Angular that provides better performance and smaller bundle sizes.%%D. Angular Ivy is a testing framework for Angular applications.% $C$",
        }
      ]
  })
  let chat = completion.data.choices[0].message.content
  let pregunta = chat.split("%",7)
  let respuesta = chat.split("$")[1]
  db.questions.insert(
    {
      "chat" : chat,
      "pregunta" : pregunta,
      "respuesta": respuesta
    }
  )
  res.render('index', { title: req.post }); */
});

module.exports = router;
