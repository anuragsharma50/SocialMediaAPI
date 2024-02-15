import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DB_URL;

export const connectUsingMongoose = async () => {
    try{
        await mongoose.connect(`${url}/socialMedia`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Connect to MongoDB using mongoose");
    } catch(err) {
        console.log(err);
        console.log("Something went wrong with db connection");
    }
}
