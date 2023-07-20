import styles from './login.module.css'

const Login = () => {

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

            <button onClick={(e) => onClickHandler(e)}>Login</button>

            <p className={styles.pEl}>or <a href='/register'>Sign up</a></p>
        </form>
    )
}

export default Login