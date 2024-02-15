import mongoose from 'mongoose';

export const postSchema = mongoose.Schema({
    imageUrl: {
        data: {
            type: Buffer,
            required: true
        },
        contentType: String
    },
    caption: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment',
        }
    ]
})

export const postModel = mongoose.model("post",postSchema);