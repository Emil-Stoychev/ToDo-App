import { useNavigate } from 'react-router-dom'
import styles from './navigation.module.css'
import { useContext } from 'react'
import { AuthContext } from '../../context/authContext'

export const Navigation = () => {
    const { user, setUser } = useContext(AuthContext)
    const navigate = useNavigate()

    const logout = () => {
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