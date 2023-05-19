const express = require('express')
const router = express.Router()
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/hads23lab', ['questions'])
const bcrypt = require('bcryptjs')

/* Register new user (/register) */
router.post('/' , async function (req, res, next) {
    console.log(req.body)
    
    //Hash password:
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    let newUser = {
      "email" : req.body.email,
      "name" : req.body.name,
      "surname" : req.body.surname,
      "password" : hashedPassword,
      "level" : 1,
      "questions" : [
        {
          "question" : "You'll learn Angular with this application?",
          "qType" : "Binary", 
          "response" : "True"
        }
      ]
    }
  
    db.users.findOne({"email": req.body.email}, (err, doc) => {
      if (err) {
          res.send({
            "error": "*Username already exists."
          });
      } else {
          console.log(doc)
          if(doc != null){
            res.send({
              "error": "*Username already exists."
            });
          }
          else{
              db.users.insert(newUser,
                  (err, result) => {
                      if (err) {
                          res.send(err);
                      } else {
                          res.send({
                            "message": 'User successfully registered.'
                          })
                      }
                  });
          }
      }
    })
  })

  module.exports = router;