import { transporter } from  "../config/Email.config.js";
//after the user data is saved it sends the email with verification code at this file
import { Verification_Email_Template ,Reset_Password_Template,Welcome_Email_Template,Reset_Password_Successfull_Template} from "./EmailTemplate.js";

export const SendVerificationCode=async(email,verificationCode)=>{
    try {
        const response = await transporter.sendMail({
            from: '"Setflix 👻" <khatriyubraj1157@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify your Email ✔", // Subject line
            text: "Verify your Email", // plain text body
            html: Verification_Email_Template.replace("{verificationCode}",verificationCode), // html body
          });
        console.log('Email sent successfully',response);
    } catch (error) {
        console.log('Email error');
    }
}

export const WelcomeEmail=async(email,username)=>{
    try {
        const res = await transporter.sendMail({
            from: '"Setflix 👻" <khatriyubraj1157@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Welcome Email ✔", // Subject line
            text: "Welcome Email", // plain text body
            html: Welcome_Email_Template.replace("{name}",username), // html body
          });
        console.log('Email sent successfully',res);
    } catch (error) {
        console.log('Email error while sending a Welcome email');
    }
}

export const sendResetPasswordOtp = async(email,resetPasswordOtp)=>{
    try {
        const response = await transporter.sendMail({
            from: '"Setflix 👻" <khatriyubraj1157@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Reset your Password ✔", // Subject line
            text: "Reset your Password", // plain text body
            html: Reset_Password_Template.replace("{resetPasswordCode}",resetPasswordOtp), // html body
          });
        console.log('Email sent successfully',response);
    } catch (error) {
        console.log('Email error');
    }

}

export const resetPasswordSuccessfullEmail=async(email,username)=>{
    try {
        const res = await transporter.sendMail({
            from: '"Setflix 👻" <khatriyubraj1157@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Password successfully resetted ✔", // Subject line
            text: "Password successfully resetted", // plain text body
            html: Reset_Password_Successfull_Template.replace("{name}",username), // html body
          });
        console.log('Email sent successfully after successfully resetting password',res);
    } catch (error) {
        console.log('Email error while sending a Reset Password successfull email');
    }
}
