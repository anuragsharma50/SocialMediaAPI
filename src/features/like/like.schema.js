import mongoose from "mongoose";

export const likeSchema = mongoose.Schema({
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'on_model'
    },
    on_model: {
        type: String,
        enum: ['Post','Comment']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
})

