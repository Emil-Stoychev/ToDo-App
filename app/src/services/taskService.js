
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

export const editTask = (taskId, value, token) => {
    return fetch(`${URL}/editTask/${token}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ taskId, value })
    })
        .then(res => res.json())
}

export const moveTask = (taskId, mainId, num, token) => {
    return fetch(`${URL}/moveTask/${taskId}/${mainId}/${num}/${token}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify()
    })
        .then(res => res.json())
}

export const addOrRemoveUserToProject = (userId, mainId, token) => {
    return fetch(`${URL}/addOrRemoveUser/${token}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, mainId })
    })
        .then(res => res.json())
}

export const deleteTask = (taskId, mainTaskId, token) => {
    return fetch(`${URL}/deleteTask/${taskId}/${mainTaskId}/${token}`, {
        method: "DELETE",
    })
}

export const deleteMainTask = (mainId, token) => {
    return fetch(`${URL}/deleteMainTask/${mainId}/${token}`, {
        method: "DELETE",
    })
}