import { useRef } from 'react'
import styles from './register.module.css'

const Register = () => {
    const uploadImage = useRef(null)
    
    const onClickHandler = (e) => {
        e.preventDefault()
    }

    return (
        <form className={styles.form}>
            <div className={styles.divInputs}>
                <label htmlFor='email'>Email</label>
                <input type='email' id='email' name='email' placeholder='John@email.com' />
            </div>

            <div className={styles.divInputs}>
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' name='password' placeholder='*******' />
            </div>

            <div className={styles.divInputs}>
                <label htmlFor='re-password'>Re-pass</label>
                <input type='password' id='re-password' name='rePassword' placeholder='*******' />
            </div>

            <div className={styles.divInputs}>
                <input type='file' className='none' ref={(e) => uploadImage.current = e} />
                <button onClick={() => uploadImage.current.click()} className={styles.btnPrimary}>Upload image</button>
            </div>

            <button className={styles.btnPrimary} onClick={(e) => onClickHandler(e)}>Register</button>

            <p className={styles.pEl}>or <a href='/login'>Sign in</a></p>
        </form>
    )
}

export default Register