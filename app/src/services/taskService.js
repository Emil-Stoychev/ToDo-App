
let a = window.location.origin.split(':3000')

const URL = a[0] + ':3030/tasks'

export const getUserTasks = (token, userId) => {
    return fetch(`${URL}/${token}/${userId}`)
        .then(res => res.json())
}

export const getCurrentTask = (taskId, token) => {
    return fetch(`${URL}/getTask/${taskId}/${token}`)
        .then(res => res.json())
}



export const createNewMain = (data) => {
    return fetch(`${URL}/createNewMain/${data.token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}

export const createTask = (data) => {
    return fetch(`${URL}/createTask/${data.token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}

