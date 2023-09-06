import { useNavigate } from 'react-router-dom'
import styles from './navigation.module.css'
import { useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { OnlineUsersContext } from '../../context/onlineUsersContext'

export const Navigation = () => {
    const { user, setUser } = useContext(AuthContext)
    const { socket } = useContext(OnlineUsersContext)
    const navigate = useNavigate()

    const logout = () => {
        socket.current?.disconnect()

        setUser(null)
        localStorage.removeItem('sessionStorage')
        navigate('/login')
    }

    return (
        <nav className={styles.navCont}>
            <ul className={styles.navUl}>
                <li onClick={() => navigate('/')}>Home</li>
                {user != null &&
                    <li onClick={() => navigate('/profile')}>Profile</li>
                }
            </ul>

            <ul className={styles.navUl}>
                {user != null
                    ? <li onClick={() => logout()}>Logout</li>
                    :
                    <>
                        <li onClick={() => navigate('/login')}>Login</li>
                        <li onClick={() => navigate('/register')}>Register</li>
                    </>
                }
            </ul>
        </nav>
    )
}