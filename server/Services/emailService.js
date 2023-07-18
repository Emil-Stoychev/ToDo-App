const nodemailer = require('nodemailer')
const { verificationComplete } = require('../utils/emailtemplate/completeVerification');
const { emailTemplate } = require('../utils/emailtemplate/emailtemplate');
const { passwordChanged } = require('../utils/emailtemplate/passwordChanged');
const { profileEdited } = require('../utils/emailtemplate/profileEdited');

const user = process.env.user
const pass = process.env.pass

function sendEmail(option, email, id) {

    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user,
                pass
            }
        })

        transporter.sendMail(messageByOption(option, email, id), function (error, info) {
            try {
                return resolve({ message: 'Email sent successfully!' })
            } catch (error) {
                console.log(error);
                return reject({ message: 'An error has occured!' })
            }
        })

    })
}

function messageByOption(option, email, id) {
    let subject = ''
    let html

    if (option == 'sendCode') {
        subject = 'Email verification!'
        html = emailTemplate(id)
    } else if (option == 'Verification complete!') {
        subject = 'Verification successful!'
        html = verificationComplete()
    } else if (option == 'Change password!') {
        subject = 'Your password was changed!'
        html = passwordChanged()
    } else if (option == 'Profile edit!') {
        subject = 'Your profile was edited!'
        html = profileEdited()
    }

    return {
        from: user,
        to: email,
        subject,
        html
    }
}

module.exports = {
    sendEmail
}


