import { createContext, useEffect, useState } from "react";
import * as authService from '../services/authService'
export const AuthContext = createContext()

export const AuthContextProvider = ({
    children,
}) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        let token = localStorage.getItem('sessionStorage')

        if (token) {
            authService.getUserByToken(token)
                .then(res => {
                    if (res.email) {
                        setUser({
                            token,
                            _id: res?._id,
                            email: res?.email,
                        })
                    } else {
                        console.log(res);
                        setUser(null)
                    }
                })
        } else {
            setUser(null)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}