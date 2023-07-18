const { User } = require("../Models/User.js")
const { Chat } = require("../Models/Chat.js")
const { MessageModel } = require("../Models/MessageModel")
const { createImage } = require("./chatImageService.js")
const { ChatImage } = require("../Models/ChatImage.js")
const sharp = require("sharp");

const createChat = async (senderId, receiverId) => {
    try {
        let currChat = await findChat(senderId, receiverId)


        if (currChat) {
            await Chat.findByIdAndUpdate(currChat._id, { $set: { updatedAt: new Date() } })

            return { message: 'This chat already exist!' }
        }

        const newChat = new Chat({
            members: [senderId, receiverId]
        })

        await Chat.findByIdAndUpdate(newChat._id, { $set: { updatedAt: new Date() } })

        return await newChat.save()
    } catch (error) {
        console.error(error)
        return error
    }
}

const userChats = async (userId) => {
    try {
        let chat = await Chat.find({ members: { $in: [userId] } })
            .populate('members', ['image', 'username', 'location'])
            .sort('-updatedAt')

        return chat
    } catch (error) {
        console.error(error)
        return error
    }
}

const findChat = async (firstId, secondId) => {
    try {
        const chat = await Chat.findOne({
            members: { $all: [firstId, secondId] }
        })

        return chat
    } catch (error) {
        console.error(error)
        return error
    }
}

const addMessage = async (chatId, senderId, text, image) => {
    try {
        let imageData

        if (image) {
            imageData = await createImage(senderId, image)
        }

        const message = new MessageModel({
            chatId,
            senderId,
            text,
            image: imageData?._id || undefined
        })

        let newMessage = await message.save()

        let currChat = await Chat.findByIdAndUpdate(chatId, { $set: { updatedAt: new Date() } })

        // await User.findByIdAndUpdate(currChat.members[0], { $pull: { chat: chatId } })
        // await User.findByIdAndUpdate(currChat.members[1], { $pull: { chat: chatId } })

        // await User.findByIdAndUpdate(currChat.members[0], { $push: { chat: chatId } })
        // await User.findByIdAndUpdate(currChat.members[1], { $push: { chat: chatId } })

        return await MessageModel.findById(newMessage._id)
            .populate('image', ['thumbnail'])
    } catch (error) {
        console.error(error)
        return error
    }
}

const getMessages = async (chatId, skipNumber) => {
    try {
        let result = await MessageModel.find({ chatId })
            .populate('image', ['thumbnail'])
            .sort({ createdAt: -1 })
            .skip(skipNumber)
            .limit(10)

        return result.reverse()
    } catch (error) {
        console.error(error)
        return error
    }
}

const deleteMessage = async (messageId, userId) => {
    try {
        let message = await MessageModel.findById(messageId)

        if (!message) {
            return { message: "404 Not found!" }
        }

        if (message.senderId != userId) {
            return { message: "You cannot delete this message!" }
        }

        return await MessageModel.findByIdAndDelete(messageId)
    } catch (error) {
        console.error(error)
        return error
    }
}

const createImage = async (author, image) => {

    const buffer = Buffer.from(image.split(";base64,").pop(), "base64");

    return sharp(buffer)
        .resize(120, 120, { fit: "inside" })
        .toBuffer()
        .then(async (thumbnail) => {
            return await ChatImage.create({
                image,
                thumbnail: `data:image/jpeg;base64,${thumbnail.toString("base64")}`,
                author,
            });
        });
}

const getFullImage = async (imageId) => {
    return await ChatImage.findById(imageId)
}

module.exports = {
    createChat,
    userChats,
    findChat,
    addMessage,
    getMessages,
    deleteMessage,
    createImage,
    getFullImage
}