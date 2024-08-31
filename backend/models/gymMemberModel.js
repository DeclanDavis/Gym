import mongoose from "mongoose";

const gymMemberSchema = mongoose.Schema({
    
    // ID: {
    //     type: Number,
    //     required: true
    // },  ID will be handled automatically by mongoDb

    title: {
        type: String,
        required: true,
        enum: ["Mx", "Ms", "Mr", "Mrs", "Miss", "Dr", "Other"]
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    premiumMembership: {
        type: Boolean,
        required: true
    }
},
    {
        timestamps: true,
    }
);

// Middleware for removing associated memberClasses
gymMemberSchema.post('remove', async function(doc, next) {
    try {
        console.log('Post-remove middleware triggered for gymMember');
        await MemberClass.deleteMany({ userID: doc._id });
        next();
    } catch (error) {
        console.error('Error in post-remove middleware for gymMember:', error);
        next(error);
    }
});

export const GymMember = mongoose.model('GymMember', gymMemberSchema);