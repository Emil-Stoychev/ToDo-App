const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sharp = require("sharp");
const shortid = require('shortid');

const { User } = require('../Models/User')
const { registerSchema, profileEditSchema } = require('../utils/userValidator');
const { sendEmail } = require('./emailService');

let secret = process.env.secret

const getUserById = async (userId) => {
    try {
        let userAcc = await User.findById(userId)

        if (!userAcc) {
            return { message: "User doesn't exist!" }
        }

        return userAcc
    } catch (error) {
        return error
    }
}

const getUserByUsernames = async (searchValue) => {
    try {
        let users = await User.find({ username: { $regex: ("^" + searchValue) } })

        return users
    } catch (error) {
        return error
    }
}

const getAllUsersByIds = async (ids) => {
    try {
        return await User.find({ _id: { $in: [ids] } })
    } catch (error) {
        return error
    }
}

const login = async (data) => {
    try {
        let { email, password, verificationId } = data

        let user = await User.findOne({ email })

        if (!user) {
            return { message: "Email or password don't match!" }
        }

        let isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return { message: "Email or password don't match!" }
        }

        if (verificationId != '') {
            if (user.verification != verificationId) {
                return { message: "Wrong verification code!" }
            }

            await sendEmail('Verification complete!', user.email, verificationId)

            user.verification = 'True'

            user.save()
        }

        if (user.verification != 'True') {
            return { message: "Email is not verified!" }
        }

        let result = await new Promise((resolve, reject) => {
            jwt.sign({ _id: user._id, email: user.email }, secret, { expiresIn: '2d' }, (err, token) => {
                if (err) {
                    return reject(err)
                }

                resolve(token)
            })
        })

        return { message: 'yes', token: result, _id: user?._id, email: user?.email }
    } catch (error) {
        return error
    }
}

const register = async (data) => {
    try {
        let userCheck = registerSchema(data)

        if (userCheck) {
            return userCheck
        }

        // let isExist = await User.findOne({ email: user.email })
        let isExist = await User.findOne({ "email": { "$regex": data.email, "$options": "i" } })

        if (isExist) {
            return { message: "Email already exist!" }
        }

        if (data.image != '') {
            const buffer = Buffer.from(data?.image.split(";base64,").pop(), "base64");

            data.image = await sharp(buffer)
                .resize(150, 150, { fit: "inside" })
                .toBuffer()
                .then(async (thumbnail) => {
                    return `data:image/jpeg;base64,${thumbnail.toString("base64")}`
                });
        }

        let hashedPassword = await bcrypt.hash(data.password, 10)

        let verificationId = shortid.generate()

        let isReadyEmail = await sendEmail('sendCode', data.email, verificationId)

        if (isReadyEmail.message == 'An error has occured!') {
            return { message: 'Email is not valid!' }
        }

        let createdUser = {
            email: data.email,
            username: data.username,
            password: hashedPassword,
            verification: verificationId,
            image: data.image || '',
            tasks: [],
            followers: [],
            following: [],
            foreignTask: [],
            chat: [],
        }

        await User.create(createdUser)

        return { message: 'yes' }
    } catch (error) {
        return error
    }
}

const toggleFollowPerson = async (userId, ownId) => {
    try {
        let targetUser = await getUserById(userId)
        let myUser = await getUserById(ownId)

        if (!targetUser.email || !myUser.email) {
            return { message: "User doesn't exist!" }
        }

        if (targetUser.followers.includes(ownId)) {
            targetUser.followers = targetUser.followers.filter(x => x != ownId)
            myUser.following = myUser.following.filter(x => x != userId)
        } else {
            targetUser.followers.push(ownId)
            myUser.following.push(userId)
        }

        targetUser.save()
        myUser.save()

        return targetUser.followers
    } catch (error) {
        console.error(error)
        return error
    }
}

const editProfile = async (data) => {
    try {
        let { values, userId } = data

        let user = await User.findById(userId)

        if (!user) {
            return { message: "User not found!" }
        }

        let oldPass = await bcrypt.compare(values.password, user?.password)

        if (!oldPass) {
            return { message: "Wrong password!" }
        }

        // let userIsValid = profileEditSchema(values)

        // if (userIsValid.message) {
        //     return userIsValid
        // }

        let hashedPassword = await bcrypt.hash(values.newPassword, 10)

        if (values.image != '') {
            const buffer = Buffer.from(values?.image.split(";base64,").pop(), "base64");

            values.image = await sharp(buffer)
                .resize(150, 150, { fit: "inside" })
                .toBuffer()
                .then(async (thumbnail) => {
                    return `data:image/jpeg;base64,${thumbnail.toString("base64")}`
                });

            user.image = values.image
        }

        if (values.newPassword != '') {
            await sendEmail('Change password!', user.email, '')
        } else {
            await sendEmail('Profile edit!', user.email, '')
        }

        user.password = hashedPassword

        user.save()

        console.log('finished');
        return user
    } catch (error) {
        return error
    }
}

const deleteAcc = async (password, userId) => {
    try {
        let user = await User.findById(userId)

        if (!user) {
            return { message: "User not found!" }
        }

        let oldPass = await bcrypt.compare(password, user?.password)

        if (!oldPass) {
            return { message: "Wrong password!" }
        }

        await User.findByIdAndDelete(userId)

        return { message: 'finished' }
    } catch (error) {
        console.error(error)
        return error
    }
}

module.exports = {
    login,
    register,
    getUserById,
    editProfile,
    toggleFollowPerson,
    deleteAcc,
    getAllUsersByIds,
    getUserByUsernames,
}