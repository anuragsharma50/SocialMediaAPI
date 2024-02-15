import mongoose from 'mongoose';

export const userSchema = mongoose.Schema({
    name: {
        type:String,
        required:true,
        min:[3,"Name should be atleast 3 characters long"]
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\../,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male','Female','Other']
    },
    logins: [{
        type: String
    }],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
})

