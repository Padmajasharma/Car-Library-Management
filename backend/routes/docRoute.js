const express = require('express');
const router = express.Router();


router.get('/docs', (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/39757207/2sAY55beCw');
});

module.exports=router