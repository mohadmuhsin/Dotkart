const nodemailer = require("nodemailer");

const { verifyEmail } = require("./template/verify.mail");
require("dotenv").config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "muhsinmfz@gmail.com",
        pass: "evyk rorw rvwn ouxj",
    },
});

async function sendVerifyEmailAsLink(to, subject, otp) {
    try {
        const mailOptions = {
            from: "Dotkart",
            to,

            subject: subject,
            html: verifyEmail(otp),
            replyTo: "muhsinmfz@gmail.com",
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
        return { status: true,info:info };
    } catch (error) {
        console.error("Error sending email:", error);
        return { status: false };
    }
}





module.exports = {
    sendVerifyEmailAsLink,
};
