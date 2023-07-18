const emailPattern = '^(?:[A-Za-z]+[0-9]+|[A-Za-z]+|[0-9]+[A-Za-z]+)\\@[A-Za-z]+\\.[A-Za-z]+$'

const emailRegex = new RegExp(emailPattern)

const userValidator = (user) => {
    let { email, username, password, rePassword, location, image } = user

    if (email.length < 3 || email.trim() === '') {
        return { message: 'Email is not valid!' }
    }

    if (username.length < 3 || username.trim() === '' || username.length > 12) {
        return { message: 'Username is not valid! (3-12 characters)' }
    }

    if (password != rePassword) {
        return { message: "Passwords don't match!" }
    }

    if (!password || password.length < 3 || password.trim() === '') {
        return { message: 'Password must be at least 3 characters!' }
    }

    if (image != '') {
        if (!image.startsWith('data:image')) {
            return { message: 'Profile picture should be valid!' }
        }
    }

    return { email, username, password, location, image }
}

const editUserValidator = (user) => {
    let { username, password, newPassword, location, image } = user

    if (username.length < 3 || username.trim() === '' || username.length > 12) {
        return { message: 'Username is not valid! (3-12 characters)' }
    }

    if (newPassword != '') {
        if (!newPassword || newPassword.length < 3 || newPassword.trim() === '') {
            return { message: "New password must be at least 3 characters!" }
        }

        password = newPassword
    }

    if (!password || password.length < 3 || password.trim() === '') {
        return { message: 'Password must be at least 3 characters!' }
    }

    if (image != '') {
        if (!image.startsWith('data:image')) {
            return { message: 'Profile picture should be valid!' }
        }
    }

    return { username, password, location, image }
}

module.exports = {
    userValidator,
    editUserValidator
}