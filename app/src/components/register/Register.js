import { useEffect, useRef, useState } from 'react'
import styles from './register.module.css'
import { addOneImage, removeOneImage } from '../../utils/addRemoveImages'
import registerSchema from '../../joiValidator/register'

const Register = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        rePassword: '',
        image: ''
    })
    const uploadImage = useRef(null)

    const onChangeHandler = (e) => {
        setValues(oldState => ({
            ...oldState,
            [e.target.name]: e.target.value
        }))
    }

    const onClickHandler = (e) => {
        e.preventDefault()

        let checkData = registerSchema(values)
        if (!checkData) {
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

            <div className={styles.divInputs}>
                <label htmlFor='re-password'>Re-pass</label>
                <input type='password' id='re-password' value={values.rePassword} onChange={(e) => onChangeHandler(e)} name='rePassword' placeholder='*******' />
            </div>

            <div className={styles.divInputs}>
                <input type='file' className='none' onChange={(e) => addOneImage(e, values, setValues)} ref={(e) => uploadImage.current = e} />
                <button type='button' onClick={() => uploadImage.current.click()} className={styles.btnPrimary}>Upload image</button>
            </div>

            <div className={styles?.['inputBox-uploadImages']}>
                {values.image !== '' &&
                    <div key={values.image}>
                        <img src={values.image} />
                        <input
                            className={styles?.["inputBox-UploadImage-Btn"]}
                            type="button"
                            value="X"
                            onClick={(e) => removeOneImage(e, values, setValues)}
                        />
                    </div>
                }
            </div>

            <button className={styles.btnPrimary} onClick={(e) => onClickHandler(e)}>Register</button>

            <p className={styles.pEl}>or <a href='/login'>Sign in</a></p>
        </form>
    )
}

export default Register