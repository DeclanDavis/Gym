import express from 'express';
import { MemberClass } from '../models/memberClassModel.js';
import { GymMember } from '../models/gymMemberModel.js';
import { GymClass } from '../models/gymClassModel.js'

const router = express.Router();

// Route to create a new memberClass -- CREATE
router.post('/', async (request, response) => {
    try {
        const { userID, classID } = request.body;

        // Check if userID and classID are provided
        if (!userID || !classID) {
            return response.status(400).send({ message: "All required fields must be provided." });
        }

         // // Check if the user is already taking the class
        const existingMemberClass = await MemberClass.findOne({ userID, classID }).populate('userID classID');

        if (existingMemberClass) {
            // If the user is already taking the class, construct a custom error message
            const { firstName, lastName } = existingMemberClass.userID;
            const { className } = existingMemberClass.classID;
            const AlreadyEnrolledMessage = `${firstName} ${lastName} is already taking class ${className}.`;
            return response.status(201).send({ 
                message: AlreadyEnrolledMessage 
            });
        }

        // Create a new memberClass
        const memberClass = await MemberClass.create({ userID, classID });

        // On success, construct a success message
       const user = await GymMember.findById(userID);
       const className = await GymClass.findById(classID);
       const successMessage = `${user.firstName} ${user.lastName} is signed up for ${className.className}.`;
       return response.status(201).send({ 
           message: successMessage,
           data: memberClass
       });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to RETRIEVE all memberClass
router.get('/', async (request, response) => {
    try {
        const memberClass = await MemberClass.find({});

        return response.status(200).json({
            count: memberClass.length,
            data: memberClass
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to Get one random MemberClass from database ------ RETRIEVE RANDOM
router.get('/random', async (request, response) => {
    try {
        // Retrieve all MemberClass from the database
        const allMemberClass = await MemberClass.find({});

        // If no MemberClass are found, return a 404 status with a message indicating that no MemberClass were found
        if (!allMemberClass || allMemberClass.length === 0) {
            return response.status(404).json({ message: "No Member Class found" });
        }

        // Generate a random index to select a random MemberClass from the array
        const randomIndex = Math.floor(Math.random() * allMemberClass.length);

        // Retrieve the random MemberClass using the random index
        const randomMemberClass = allMemberClass[randomIndex];

        // Return the random customer with a status of 200
        return response.status(200).json(randomMemberClass);
    } catch (error) {
        console.log(error.message);         // If error return a 500 status with an error message
        response.status(500).send({ message: error.message });
    }
});

// // Route to RETRIEVE matching MemberClass based on userID
router.get('/matchingMemberClass', async (request, response) => {
    try {
        const { userID } = request.query;

        // Retrieve matching MemberClass based on userID
        const matchingMemberClasses = await MemberClass.find({ userID });

        // Initialize arrays to store class names and user name
        const classNames = [];
        let userName = '';

        // Iterate through each matching MemberClass
        matchingMemberClasses.forEach(memberClass => {
            classNames.push(memberClass.classID); // Store classIDs for further retrieval
        });

        // Query the database to retrieve class names based on classIDs
        const classes = await GymClass.find({ _id: { $in: classNames } });

        // Construct a map of classIDs and their corresponding class names
        const classMap = {};
        classes.forEach(c => {
            classMap[c._id] = c.className;
        });

        // Construct the response message
        const enrolledClasses = matchingMemberClasses.map(memberClass => classMap[memberClass.classID]);
        const classList = enrolledClasses.join(', ');

        // Query the database to retrieve user name based on userID
        const user = await GymMember.findOne({ _id: userID });

        // If user is found, construct user name
        if (user) {
            userName = `${user.firstName} ${user.lastName}`;
        }

        // Construct the final response message
        const message = `User ID: ${userID}, ${userName}, is enrolled in ${matchingMemberClasses.length} class${matchingMemberClasses.length !== 1 ? 'es' : ''}: ${classList}`;

        // Return the response to the frontend
        return response.status(200).json({ 
            message, count: matchingMemberClasses.length, data:matchingMemberClasses });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to Get one MemberClass by their id from database ------ RETRIEVE
router.get('/:id', async (request, response) => {
    try {

        const { id } = request.params;

        const memberClass = await MemberClass.findById(id);     //Retireve the MemberClass by their ID and store in const memberClass

        return response.status(200).json(memberClass);     // Return the MemberClass to the frontend(client)

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to Update a MemberClass by their id --- UPDATE
router.put('/:id', async (request, response) => {
    try {
        if(
            !request.body.userID ||
            !request.body.classID
        ) {
            return response.status(400).send({
                message: "Send all required fields: userID, classID",
            })
        }
        const { id } = request.params;

          // Fetch the old MemberClass object before updating
          const oldMemberClass = await MemberClass.findById(id);
          if (!oldMemberClass) {
              return response.status(404).json({ message: "Member Class not found" });
          }
  
          // Update the MemberClass object
          const updatedMemberClass = await MemberClass.findByIdAndUpdate(id, request.body, { new: true });
          if (!updatedMemberClass) {
              return response.status(404).json({ message: "Failed to update Member Class" });
          }
  
          // Return the before and after updated MemberClass objects
          return response.status(200).json({ oldMemberClass, updatedMemberClass });

    } catch (error) {
     console.log(error.message); 
     response.status(500).send({ message: error.message });  
    }
});

// Route for Deleting a Member Class by id --- DELETE
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await MemberClass.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: "Member Class not found." });
        }

        // Extract userID and classID from the deleted member class object
        const { userID, classID } = result;

        return response.status(200).send( {message: `Member Class: userID: ${userID}, classID: ${classID}, deleted successfully`});
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
});


export default router;