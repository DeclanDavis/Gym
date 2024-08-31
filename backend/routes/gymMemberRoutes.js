
import express from 'express';
import { GymMember } from '../models/gymMemberModel.js';

const router = express.Router();

// Route to CREATE a new Gym Member
router.post('/', async (request, response) => {
    try {

        const { title, firstName, lastName, emailAddress, premiumMembership } = request.body;

        if(!title || !firstName || !lastName || !emailAddress || premiumMembership === undefined){
            return response.status(400).send({message: "All required fields must be provided."})
        }
        
        const newGymMember = {
            title: title,
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            premiumMembership: premiumMembership,
    };

    const gymMember = await GymMember.create(newGymMember);

    return response.status(201).send(gymMember);

    } catch (error) {
       console.log(error.message); 
       response.status(500).send({ message: error.message });
    }
});

// Route to RETRIEVE all Gym Members
router.get('/', async (request, response) => {
    try {
        const gymMembers = await GymMember.find({});

        return response.status(200).json({
            count: gymMembers.length,
            data: gymMembers
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to Get one random Gym Member from database ------ RETRIEVE RANDOM
router.get('/random', async (request, response) => {
    try {
        // Retrieve all customers from the database
        const allGymMembers = await GymMember.find({});

        // If no customers are found, return a 404 status with a message indicating that no customers were found
        if (!allGymMembers || allGymMembers.length === 0) {
            return response.status(404).json({ message: "No Gym Members found" });
        }

        // Generate a random index to select a random customer from the array
        const randomIndex = Math.floor(Math.random() * allGymMembers.length);

        // Retrieve the random customer using the random index
        const randomCustomer = allGymMembers[randomIndex];

        // Return the random customer with a status of 200
        return response.status(200).json(randomCustomer);
    } catch (error) {
        console.log(error.message);         // If error return a 500 status with an error message
        response.status(500).send({ message: error.message });
    }
});

// Route to RETRIEVE matching Gym Members based on first name and lastname
router.get('/matchingUsers', async (request, response) => {
    try {
        const { firstName, lastName } = request.query;

        // Perform a case-sensitive search for users with matching first name and lastname
        const matchingUsers = await GymMember.find({
            firstName,
            lastName
        });

        return response.status(200).json(matchingUsers); // Return the matching users to the frontend
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to Get one GymMember by their id from database ------ RETRIEVE
router.get('/:id', async (request, response) => {
    try {

        const { id } = request.params;

        const gymMember = await GymMember.findById(id);     //Retireve the gym member by their ID and store in const gymMember

        return response.status(200).json(gymMember);     // Return the gym member to the frontend(client)

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to Update a GymMember by their id --- UPDATE
router.put('/:id', async (request, response) => {
    try {
        if(
            !request.body.title ||
            !request.body.firstName ||
            !request.body.lastName ||
            !request.body.emailAddress ||
            request.body.premiumMembership === undefined || // Check if premiumMembership is undefined
            request.body.premiumMembership === null // Check if premiumMembership is null
        ) {
            return response.status(400).send({
                message: "Send all required fields: title, firstName, lastName, emailAddress, premiumMembership",
            })
        }

        const { id } = request.params;

        const result = await GymMember.findByIdAndUpdate(id, request.body);
        if(!result) {
            return response.status(404).json({ message: "Gym Member not found" });
        }

        return response.status(200).send({ 
            message: "GymMember updated successfully.",
            data: result,
        });


    } catch (error) {
     console.log(error.message); 
     response.status(500).send({ message: error.message });  
    }
});

// Route for Deleting a Gym Member by id --- DELETE
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await GymMember.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: "Gym Member not found." });
        }

        // Extract first name and last name from the deleted gym member object
        const { firstName, lastName } = result;

        return response.status(200).send( {message: `Gym Member: ${firstName} ${lastName} deleted successfully`});
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
});

export default router;