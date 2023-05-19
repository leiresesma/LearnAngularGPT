const express = require('express')
const router = express.Router()
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/hads23lab', ['questions'])
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/* Logout user (/logout) */
router.get('/' , async function (req, res, next) {
    res.cookie('jwt', '', {
        maxAge: 0
    })
    res.send({
        message: "Successfully logged out."
    })
})

module.exports = router;