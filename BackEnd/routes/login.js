const express = require('express')
const router = express.Router()
const config = require('../config.json')
const mongojs = require('mongojs')
const db = mongojs(config['MONGODB-URL'], ['questions', 'users'])
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
                }, config.jwt.SECRET)

                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: config.jwt.MAX_AGE //(ms)
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