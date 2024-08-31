import express from 'express';
import { GymClass } from '../models/gymClassModel.js';

const router = express.Router();


// Route to create a new gymClass -- CREATE
router.post('/', async (request, response) => {
    try {

        const { className, classDay, sessionLengthHrs, price} = request.body;

        if(!className || !classDay || !sessionLengthHrs || !price){
            return response.status(400).send({message: "All required fields must be provided."})
        }
        
        const newGymClass = {
            className: className,
            classDay: classDay,
            sessionLengthHrs: sessionLengthHrs,
            price: price,
            currentNumberOfMembers: 0,
    };

        const gymClass = await GymClass.create(newGymClass);

        return response.status(201).send(gymClass);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to RETRIEVE all Gym Classes
router.get('/', async (request, response) => {
    try {
        const gymClasses = await GymClass.find({});

        return response.status(200).json({
            count: gymClasses.length,
            data: gymClasses
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to Get one random Gym Class from database ------ RETRIEVE RANDOM
router.get('/random', async (request, response) => {
    try {
        // Retrieve all Gym Classes from the database
        const allGymClasses = await GymClass.find({});

        // If no Gym Classes are found, return a 404 status with a message indicating that no Gym Classes were found
        if (!allGymClasses || allGymClasses.length === 0) {
            return response.status(404).json({ message: "No Gym Classes found" });
        }

        // Generate a random index to select a random Gym Class from the array
        const randomIndex = Math.floor(Math.random() * allGymClasses.length);

        // Retrieve the random Gym Class using the random index
        const randomCustomer = allGymClasses[randomIndex];

        // Return the random Gym Class with a status of 200
        return response.status(200).json(randomCustomer);
    } catch (error) {
        console.log(error.message);         // If error return a 500 status with an error message
        response.status(500).send({ message: error.message });
    }
});

// Route to RETRIEVE matching Gym Class based on className
router.get('/byClassName', async (request, response) => {
    try {
        const { className } = request.query;

        // Perform a case-sensitive search for classes with matching className
        const matchingClass = await GymClass.find({className});

        return response.status(200).json(matchingClass); // Return the matching classes to the frontend
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to Get one GymClass by their id from database ------ RETRIEVE
router.get('/:id', async (request, response) => {
    try {

        const { id } = request.params;

        const gymClass = await GymClass.findById(id);     //Retireve the gym class by their ID and store in const gymClass

        return response.status(200).json(gymClass);     // Return the gym class to the frontend(client)

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to Update a GymClass by their id --- UPDATE
router.put('/:id', async (request, response) => {
    try {
        if(
            !request.body.className ||
            !request.body.classDay ||
            !request.body.sessionLengthHrs ||
            !request.body.price
        ) {
            return response.status(400).send({
                message: "Send all required fields: className, classDay, sessionLengthHrs, price",
            })
        }

        const { id } = request.params;

       // Fetch the Gym Class object before updating
       const oldGymClass = await GymClass.findById(id);
       if (!oldGymClass) {
           return response.status(404).json({ message: "Gym Class not found" });
       }

       // Update the Gym Class object
       const updatedGymClass = await GymClass.findByIdAndUpdate(id, request.body, { new: true });

       // Return the before and after updated Gym Class objects
       return response.status(200).json({ oldGymClass, updatedGymClass });

    } catch (error) {
     console.log(error.message); 
     response.status(500).send({ message: error.message });  
    }
});

// Route for Deleting a Gym Class by id --- DELETE
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await GymClass.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: "Gym Class not found." });
        }

        // Extract className from the deleted gym class object
        const { className } = result;

        return response.status(200).send( {message: `Gym Class: ${className} deleted successfully`});
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
});


export default router;

