import styles from './login.module.css'
import { useContext, useState } from 'react'
import * as authService from '../../services/authService'
import { useNavigate } from 'react-router-dom'

import loginSchema from '../../joiValidator/login'
import { AuthContext } from '../../context/authContext'

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
    })
    const [verifCode, setVerifCode] = useState({
        option: false,
        value: ''
    })
    const navigate = useNavigate()

  const { setUser } = useContext(AuthContext)

    const onChangeHandler = (e) => {
        setValues(oldState => ({
            ...oldState,
            [e.target.name]: e.target.value
        }))
    }

    const onChangeVerCode = (e) => {
        setVerifCode(oldState => ({
            ...oldState,
            [e.target.name]: e.target.value
        }))
    }

    const onClickHandler = (e) => {
        e.preventDefault()

        let checkData = loginSchema(values)

        if (checkData == undefined) {
            let data = {
                email: values.email,
                password: values.password,
                verificationId: verifCode.value
            }

            authService.login(data)
                .then(res => {
                    if (res.message == 'yes') {
                        if(verifCode.option) setVerifCode({ option: false, value: '' })
                        
                        setUser({
                            token: res?.token,
                            _id: res?._id,
                            email: res?.email,
                        })
                        localStorage.setItem('sessionStorage', res.token)
                        console.log(res);

                        navigate('/')
                    } else if (res.message == 'Email is not verified!') {
                        setVerifCode({ option: true, value: '' })
                        console.log(res);
                    } else {
                        console.log(res);
                    }
                })

        } else {
            console.log(checkData);
        }
    }

    return (
        <form className={styles.form}>
            <div className={styles.divInputs}>
                <label htmlFor='email'>Email</label>
                <input type='email' id='email' name='email' value={values.email} onChange={(e) => onChangeHandler(e)} placeholder='John@email.com' />
            </div>

            <div className={styles.divInputs}>
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' value={values.password} onChange={(e) => onChangeHandler(e)} name='password' placeholder='*******' />
            </div>

            {verifCode.option &&
                <div className={styles.divInputs}>
                    <label htmlFor='verCode'>Verification Code</label>
                    <input type='text' id='verCode' value={verifCode.value} onChange={(e) => onChangeVerCode(e)} name='value' placeholder='*******' />
                </div>
            }

            <button className={styles.btnPrimary} onClick={(e) => onClickHandler(e)}>Login</button>

            <p className={styles.pEl}>or <a href='/register'>Sign up</a></p>
        </form>
    )
}

export default Login