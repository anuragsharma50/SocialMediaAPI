import nodemailer from "nodemailer";

const mailSender = async (email,title,body) => {
    try {
        // Create a Transaporter to send emails
        let transporter = nodemailer.createTransport({
            service: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        // Send emails to users
        let info = await transporter.sendMail({
            from: "codingninjas2k16@gmail.com",
            to: email,
            subject: title,
            html: body
        });

        console.log("Email info: ",info);
        return info;
    } catch (err) {
        console.log(err.message);
        throw err;
    }
}

export default mailSender;