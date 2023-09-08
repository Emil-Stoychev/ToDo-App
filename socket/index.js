
const io = require('socket.io')(8800, {
    cors: {
        origin: '*',
    }
})

let activeUsers = []

const addNewUser = (_id, socketId) => {
    !activeUsers.some((user) => user._id == _id) && activeUsers.push({ _id, socketId })
}

const getUser = (_id) => {
    return activeUsers.find((user) => user._id == _id)
}

const getUsers = (ids) => {
    return activeUsers.map((user) => { 
        if (user?._id != null && ids.includes(user?._id)) {
            return user
        } 
    })
}

io.on('connection', (socket) => {
    socket.on("newUser", (_id) => {
        addNewUser(_id, socket.id)
        io.emit('get-users', activeUsers)

        console.log('connected', socket.id);
    })

    // socket.on("sendNotification", ({ senderId, receiverId }) => {
    //     const receiver = getUser(receiverId)

    //     if (receiver != undefined) {
    //         io.to(receiver.socketId).emit("getNotification", {
    //             senderId,
    //         })
    //     }
    // })

    socket.on("new-task", ({ userId, res, mainTaskId, mainTaskAuthor, users }) => {
        if (userId != mainTaskAuthor) users.push(mainTaskAuthor)
        const allUsers = getUsers(users)

        if (allUsers?.length > 0) {
            allUsers.forEach(x => {
                io.to(x?.socketId).emit("get-new-task", {
                    res,
                    mainTaskId,
                    userId
                })
            })
        }
    })

    socket.on("delete-main-task", ({ userId, mainTaskId, users }) => {
        const allUsers = getUsers(users)

        if (allUsers?.length > 0) {
            allUsers.forEach(x => {
                io.to(x?.socketId).emit("after-delete-main-task", {
                    mainTaskId,
                    userId
                })
            })
        }
    })

    socket.on("delete-task", ({ mainTaskAuthor, mainTaskId, perpetrator, taskId, users }) => {
        if(perpetrator != mainTaskAuthor) users.push(mainTaskAuthor)
        const allUsers = getUsers(users)

        if (allUsers?.length > 0) {
            allUsers.forEach(x => {
                io.to(x?.socketId).emit("after-delete-task", {
                    mainTaskId,
                    perpetrator,
                    taskId
                })
            })
        }
    })

    socket.on("change-task-priority", ({ taskIn, priority, mainTaskAuthor, mainTaskId, perpetrator, taskId, users }) => {
        if(perpetrator != mainTaskAuthor) users.push(mainTaskAuthor)
        const allUsers = getUsers(users)

        if (allUsers?.length > 0) {
            allUsers.forEach(x => {
                io.to(x?.socketId).emit("after-change-task-priority", {
                    mainTaskId,
                    perpetrator,
                    taskId,
                    taskIn,
                    priority
                })
            })
        }
    })

    socket.on("change-task-value", ({ value, mainTaskAuthor, mainTaskId, perpetrator, taskId, users }) => {
        if(perpetrator != mainTaskAuthor) users.push(mainTaskAuthor)
        const allUsers = getUsers(users)

        if (allUsers?.length > 0) {
            allUsers.forEach(x => {
                io.to(x?.socketId).emit("after-change-task-value", {
                    mainTaskId,
                    perpetrator,
                    taskId,
                    value
                })
            })
        }
    })

    socket.on("move-task", ({ mainTaskAuthor, mainTaskId, perpetrator, replacedTask, users }) => {
        if(perpetrator != mainTaskAuthor) users.push(mainTaskAuthor)
        const allUsers = getUsers(users)

        if (allUsers?.length > 0) {
            allUsers.forEach(x => {
                io.to(x?.socketId).emit("after-move-task", {
                    mainTaskId,
                    perpetrator,
                    replacedTask
                })
            })
        }
    })

    socket.on("add-or-remove-user-from-project", ({ userId, mainTaskId, perpetrator, mainTaskAuthor, res, currentTask, users }) => {
        if (!users.find(x => x == userId)) users.push(userId)
        if (mainTaskAuthor) users.push(mainTaskAuthor)
        const allUsers = getUsers(users)

        if (allUsers?.length > 0) {
            allUsers.forEach(x => {
                io.to(x?.socketId).emit("after-add-or-remove-user-from-project", {
                    mainTaskId,
                    userId,
                    res,
                    perpetrator,
                    currentTask
                })
            })
        }
    })

    socket.on("add-or-remove-admin", ({ userId, mainTaskId, perpetrator, res, currentTask, users }) => {
        if (!users.find(x => x == userId)) users.push(userId)
        const allUsers = getUsers(users)

        if (allUsers?.length > 0) {
            allUsers.forEach(x => {
                io.to(x?.socketId).emit("after-add-or-remove-admin", {
                    mainTaskId,
                    userId,
                    res,
                    perpetrator,
                    currentTask
                })
            })
        }
    })

    socket.on('send-message', (data) => {
        if (data != null) {
            if (data?.type == 'delete') {
                const user = activeUsers.find(x => x._id == data.receiverId)

                if (user) {
                    io.to(user.socketId).emit('receive-message', { msgId: data.msgId, type: data.type, chatId: data.chatId })
                }
            } else {
                const { receiverId } = data
                const user = activeUsers.find(x => x._id == receiverId)

                if (user) {
                    io.to(user.socketId).emit('receive-message', data.res)
                }
            }
        }
    })

    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter(x => x.socketId != socket.id)
        io.emit('get-users', activeUsers)

        console.log('Disconnected: ', activeUsers);
    })
})