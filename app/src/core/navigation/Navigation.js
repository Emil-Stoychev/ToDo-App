import { useNavigate } from 'react-router-dom'
import styles from './navigation.module.css'

export const Navigation = () => {
    const navigate = useNavigate()

    return (
        <nav className={styles.navCont}>
            <ul className={styles.navUl}>
                <li onClick={() => navigate('/')}>Home</li>
                {/* <li onClick={() => navigate('/create')}>Create</li> */}
                {/* <li onClick={() => navigate('/profile')}>Profile</li> */}
            </ul>

            <ul className={styles.navUl}>
                <li onClick={() => navigate('/login')}>Login</li>
                <li onClick={() => navigate('/register')}>Register</li>
                {/* <li onClick={() => navigate('/logout')}>Logout</li> */}
            </ul>
        </nav>
    )
}