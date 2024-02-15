import mongoose from "mongoose";

export const friendshipSchema = mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    isAccepted: {
        type: Boolean,
        default: false
    }
})

