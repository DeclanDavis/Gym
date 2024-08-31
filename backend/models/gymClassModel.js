import mongoose from "mongoose";

const gymClassSchema = mongoose.Schema({
    
    // ID: {
    //     type: Number,
    //     required: true
    // },  ID will be handled automatically by mongoDb

    className: {
        type: String,
        required: true,
    },
    classDay: {
        type: String,
        required: true
    },
    sessionLengthHrs: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currentNumberOfMembers: {
        type: Number,
        required: true
    }
},
    {
        timestamps: true,
    }
);


// Middleware for removing associated memberClasses
gymClassSchema.post('remove', async function(doc, next) {
    try {
        console.log('Post-remove middleware triggered for gymClass');
        await MemberClass.deleteMany({ classID: doc._id });
        next();
    } catch (error) {
        console.error('Error in post-remove middleware for gymClass:', error);
        next(error);
    }
});


export const GymClass = mongoose.model('GymClass', gymClassSchema);