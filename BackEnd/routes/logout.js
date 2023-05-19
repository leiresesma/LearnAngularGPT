const express = require('express')
const router = express.Router()

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