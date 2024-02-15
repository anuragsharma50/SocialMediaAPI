import mongoose from "mongoose";
import mailSender from "../../utils/mailSender.js";

export const otpSchema = mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 60*5      // the document will automatically delete after 5 mins
    }
})

const sendVerificationEmail = async (email,otp) => {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            `<h1>Please confirm your OTP</h1>
            <p>Here is your OTP : ${otp}</p>`
        );
        console.log("Email sent successfully: ", mailResponse);
    } catch (err) {
        console.log("Error occured while sending mail: " , err);
        throw err;
    }
} 

otpSchema.pre("save",async function (next) {
    console.log(this);
    console.log("New OTP is saved to the DB");
    if(this.isNew) {
        await sendVerificationEmail(this.email,this.otp);
    }
    next();
})

export const OtpModel = mongoose.model("OTP",otpSchema);