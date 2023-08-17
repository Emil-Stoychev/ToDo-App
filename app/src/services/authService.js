
let a = window.location.origin.split(':3000')

const URL = a[0] + ':3030/users'

const myHeaders = new Headers({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('sessionStorage')
});

export const getUserById = (token, userId) => {
    return fetch(`${URL}/${token}/${userId}`)
        .then(res => res.json())
}

export const getUserByToken = (token) => {
    return fetch(`${URL}/${token}`)
        .then(res => res.json())
}

export const getUserByUsername = (token, searchValue) => {
    return fetch(`${URL}/getUserByUsernames/${token}/${searchValue}`)
        .then(res => res.json())
}

export const toggleFollowPerson = (token, userId) => {
    return fetch(`${URL}/toggleFollow/${token}/${userId}`)
        .then(res => res.json())
}

export const register = (data) => {
    return fetch(`${URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}

export const login = (data) => {
    return fetch(`${URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}

export const emailVerification = (data) => {
    return fetch(`${URL}/emailVerification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}

export const logout = (token) => {
    return fetch(`${URL}/logout/${token}`)
        .then(res => res.json())
}

export const editImageProfile = (image, userId, token) => {
    let data = {
        image,
        userId,
        token
    }

    return fetch(`${URL}/editImageProfile/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}

export const editProfile = (values, userId, token) => {
    let data = {
        values,
        userId,
        token
    }

    return fetch(`${URL}/editProfile/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}

export const deleteAccount = (password, token) => {
    let data = {
        password,
        token
    }

    return fetch(`${URL}/deleteAccount/${token}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}