import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import gymMemberRoute from './routes/gymMemberRoutes.js';
import gymClassRoute from './routes/gymClassRoutes.js';
import memberClassRoute from './routes/memberClassRoutes.js';
import cors from 'cors';
import { GymClass } from "./models/gymClassModel.js";
import { MemberClass } from "./models/memberClassModel.js";
import { GymMember } from './models/gymMemberModel.js';

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
// Option 1: Allow All Origins with Default of cors(*)
app.use(cors());

// //Option 2: Allow Custom Origins
// app.use(
//     cors({
//        origin: 'http://localhost:5555',
//        methods: ['GET', 'POST', 'PUT', 'DELETE'],
//        allowedHeaders: ['Content-Type'], 
//     })
// );


app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send("Welcome to Assignment 06!");
});

app.use('/gymMember', gymMemberRoute);  // handle with Gym Member Route

app.use('/gymClass', gymClassRoute); // handle with Gym Class Route

app.use('/memberClass', memberClassRoute); //handle with Member Class Route

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("App connected to the database");
        app.listen(PORT, () => {
            console.log( `App is listening to port: ${PORT}` );
        });
    })
    .catch((error) => {
        console.log(error);
    });