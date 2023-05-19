const express = require('express')
const router = express.Router()
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/hads23lab', ['questions', 'users'])
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/* Login user (/login) */
router.post('/' , async function (req, res, next) {
    db.users.findOne({"email": req.body.email}, async (err, doc) => {
        if (err) {
          res.send({
            "error" : "*The username doesn't exist." 
          });
        } else {
          console.log(doc)
          if(doc == null){
            res.send({
                "error" : "*The username doesn't exist." 
              });
          }
          else{
            //Compare hashed passwords:
            if(! await bcrypt.compare(req.body.password, doc.password)){
                res.send({
                    "error" : "*Incorrect password." 
                  });
            }
            else{
                //Save token:
                const token = jwt.sign({
                    _id : doc._id
                }, "secret")

                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000 //1 day (ms)
                })

                res.send({
                    "message" : "User successfully logged." 
                  });
            }
          }
        }
    })
})

module.exports = router;