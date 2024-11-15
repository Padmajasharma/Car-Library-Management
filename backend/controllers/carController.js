const Car = require('../models/carModel');

const addCar = async (req, res) => {
    try {
        const { title, description, tags, images } = req.body;

        if (images && images.length > 10) {
            return res.status(400).json({ message: "You can upload up to 10 images only." });
        }


        const newCar = new Car({
            user: req.user.id,
            title,
            description,
            tags,
            images
        });

        const savedCar = await newCar.save();
        res.status(201).json(savedCar);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to add car", error });
    }
};

const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find({ user: req.user.id });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve cars", error });
    }
};


const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car && car.user.toString() !== req.user.id) {
            return res.status(404).json({ message: "Car not found or unauthorized" });
        }

        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve car", error });
    }
};

const updateCar = async (req, res) => {
    try {
        const { title, description, tags, addImages, deleteImages } = req.body;

        let car = await Car.findById(req.params.id);

        if (!car || car.user.toString() !== req.user.id) {
            return res.status(404).json({ message: "Car not found or unauthorized" });
        }

        if (title) car.title = title;
        if (description) car.description = description;
        if (tags) car.tags = { ...car.tags, ...tags };


       
        if (addImages && addImages.length) {
            if ((car.images.length + addImages.length) > 10) {
                return res.status(400).json({ message: "You can upload up to 10 images only." });
            }
            car.images.push(...addImages.map(url => ({ url })));
        }


        if (deleteImages && deleteImages.length) {
            car.images = car.images.filter(image =>
                !deleteImages.includes(image.url)
            );
        }
        if(car.images.length==0){
            return res.status(400).json({ message: "You cannot delete all images." });
        }

        const updatedCar = await car.save();
        res.status(200).json(updatedCar);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to update car", error });
    }
};



const deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car || car.user.toString() !== req.user.id) {
            return res.status(404).json({ message: "Car not found or unauthorized" });
        }

        await car.deleteOne();
        res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete car", error });
    }
};

module.exports = {
    addCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar
}
