const express = require('express');
const router = express.Router();
const fetchUser = require('../middlewares/fetchUser');
const { 
    createUser, 
    loginUser, 
    getUser 
} = require('../controllers/userController');

router.post("/createuser", createUser);
router.post("/login", loginUser);
router.get("/getuser", fetchUser, getUser);


module.exports = router;