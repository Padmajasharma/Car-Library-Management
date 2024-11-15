const express = require('express');
const router = express.Router();
const fetchUser = require('../middlewares/fetchUser');

const { 
    addCar, 
    getAllCars, 
    getCarById, 
    updateCar, 
    deleteCar 
} = require('../controllers/carController');



router.post('/car/add', fetchUser, addCar);

router.get('/cars/getAll', fetchUser, getAllCars);

router.get('/car/get/:id', fetchUser, getCarById);

router.put('/car/update/:id', fetchUser, updateCar);

router.delete('/car/delete/:id', fetchUser, deleteCar);

module.exports = router;
