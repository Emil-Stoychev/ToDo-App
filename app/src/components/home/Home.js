import styles from './home.module.css'

import Guest from './guest/Guest'
import User from './user/User'
import { useContext } from 'react'
import { AuthContext } from '../../context/authContext'

const Home = () => {
    const { user } = useContext(AuthContext)

    return (
        <>
            {user != null
                ? <User />
                : <Guest />
            }
        </>
    )
}

export default Home