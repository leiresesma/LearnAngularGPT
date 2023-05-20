const express = require('express')
const router = express.Router()
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/hads23lab', ['questions'])
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator');

/* Register new user (/register) */
router.post('/' , [
  check('email', 'name', 'surname', 'password', 'rpassword').notEmpty().withMessage('*All fields are necessary.'),
  check('email').isEmail().withMessage("*Incorrect email format."),
  check('password').isLength({min: 8}).withMessage("*The minimum length of the password must be 8 characters.")
], async function (req, res, next) {
  const validationErrors = validationResult(req);
    //console.log(validationErrors)
    if(!validationErrors.isEmpty())
    {
      return res.status(400).json({
        msg: validationErrors.errors[0].msg
      })
    }

    if(req.body.password !== req.body.rpassword)
      return res.status(400).json({
        msg: "*The passwords do not match."
      })

    db.users.findOne({"email": req.body.email}, async (err, doc) => {
      if (err) {
        return res.status(400).json({
          msg: "*The username already exists."
        })
      } else {
          if(doc != null){
            return res.status(400).json({
              msg: "*The username already exists."
            })
          }
          else{
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
                  "answer" : "True"
                }
              ]
            }
            db.users.insert(newUser,
                (err, result) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send({
                          "msg": 'User successfully registered.'
                        })
                    }
                }
            );
          }
      }
    })
  })

module.exports = router;