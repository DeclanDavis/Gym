import mongoose from "mongoose";
import { GymClass } from './gymClassModel.js'; // Import the GymClass model
import { GymMember } from './gymMemberModel.js';

const memberClassSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GymMember', // Reference to GymMember model
        required: true
    },
    classID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GymClass', // Reference to GymClass model
        required: true
    }
},
{
    timestamps: true
});


// Middleware to update currentNumberOfMembers when a member joins a class
memberClassSchema.pre('save', async function(next) {
    try {
        console.log('Pre-save middleware triggered');
        const memberClass = this;
        const gymClass = await GymClass.findById(memberClass.classID);

        if (gymClass) {
            gymClass.currentNumberOfMembers += 1; // Increment currentNumberOfMembers
            await gymClass.save();
            console.log('currentNumberOfMembers incremented:', gymClass.currentNumberOfMembers);
        }

        next();
    } catch (error) {
        console.error('Error in pre-save middleware:', error);
        next(error);
    }
});

// Middleware to update currentNumberOfMembers when a member leaves a class
memberClassSchema.post('remove', async function(doc, next) {
    try {
        console.log('Post-remove middleware triggered');
        const gymClass = await GymClass.findById(doc.classID);

        if (gymClass) {
            gymClass.currentNumberOfMembers -= 1; // Decrement currentNumberOfMembers
            await gymClass.save();
            console.log('currentNumberOfMembers decremented:', gymClass.currentNumberOfMembers);
        }

        next();
    } catch (error) {
        console.error('Error in post-remove middleware:', error);
        next(error);
    }
});


export const MemberClass = mongoose.model('MemberClass', memberClassSchema);