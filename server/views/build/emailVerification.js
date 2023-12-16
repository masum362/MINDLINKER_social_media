import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import {v4 as uuid4} from 'uuid';
import { hashString } from '../../utils/index.js';
import Verification from '../../model/verificationSchema.js';

dotenv.config();

const {AUTH_EMAIL,AUTH_PASSWORD,APP_URL} = process.env;

const transporter = nodemailer.createTransport({
    host:"smtp-mail.outlook.com",
    // port: 465,
    // secure: true,
    auth:{
        user:AUTH_EMAIL,
        pass:AUTH_PASSWORD
    }
})

export const sendVerificationEmail = async(user , res) => {
    const {_id , email, lastName} = user;

    const token = _id + uuid4();


    const link = APP_URL + "users/verify/"+_id + "/" + token;

const mailOptions = {
    from:AUTH_EMAIL,
    to:email,
    subject:"Email Verification",
    html: `<div
    style='font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 5px;'>
    <h3 style="color: rgb(8, 56, 188)">Please verify your email address</h3>
    <hr>
    <h4>Hi ${lastName},</h4>
    <p>
        Please verify your email address so we can know that it's really you.
        <br>
    <p>This link <b>expires in 1 hour</b></p>
    <br>
    <a href=${link}
        style="color: #fff; padding: 14px; text-decoration: none; background-color: #000;  border-radius: 8px; font-size: 18px;">Verify
        Email Address</a>
    </p>
    <div style="margin-top: 20px;">
        <h5>Best Regards</h5>
        <h5>ShareFun Team</h5>
    </div>
</div>`
}

try {
    const hashedToken = await hashString(token);
    const newVerifiedEmail = await Verification.create({
        userId:_id,
        token:hashedToken,
        createdAt:Date.now(),
        expiresAt:Date.now() + 3600000
    });

    if(newVerifiedEmail){
         transporter.sendMail(mailOptions).then(() => {
            res.status(201).json({
                success:"PENDING",
                message:"Verification email has been sent to your account.Check your email for further instructions."
            })
         }) 
    }
} catch (error) {
    console.log(error.message);
    return res.status(404).json({message:error.message})
}

}