const express = require('express')
const router = express.Router()
const config = require('../../config.json')
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: config.openai.organization,
    apiKey: config.openai.apiKey,
});
const openai = new OpenAIApi(configuration);

/* Get ChatGPT response from input(/home) */
router.post('/' , async function (req, res, next) {
    userQuestion = req.body.questionUserInput;
    userAns = req.body.givenAnswer;
   const completion = await openai.createChatCompletion({
        model : "gpt-3.5-turbo",
        messages:[
            { 
            role: "user", content: "Hello, I want to learn Angular.  I'm going to give you my question and my answer and you've got to tell me if it's wrong or right by writing 'True' for true and 'False' for false between the simbols '%'. If it is false, write me the reason bewteen the simbol '$'. For example: %False% $Because it's false$.\
            Question:" +  userQuestion +
           "Answer:" + userAns,
        }
        ]   
    })
    let chatResponse = completion.data.choices[0].message.content  
    response= chatResponse.split("%")[1]
    explanation = chatResponse.split("$")[1]
    
    let answer = {
        "response" : response,
        "explanation" : explanation, 
        
    }
    res.send(answer)
})


module.exports = router;
