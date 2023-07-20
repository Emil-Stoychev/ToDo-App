import { useState } from 'react'
import styles from './faq.module.css'

export const BoxTemplate = () => {
    const [select, setSelect] = useState(false)

    return (
        <div className={styles.box}>
            <div className={styles.smallBox}>
                <h2 className={styles.text}>Can I create task without registration?</h2>
                <button onClick={() => setSelect(state => !state)} className={styles.btnPrimary}>{select ? '-' : '+'}</button>
            </div>

            {select && <p className={styles.text}>No, Like a guest you can't create tasks or something else! No, Like a guest you can't create tasks or something else! No, Like a guest you can't create tasks or something else! No, Like a guest you can't create tasks or something else! No, Like a guest you can't create tasks or something else! No, Like a guest you can't create tasks or something else!</p>}
        </div>
    )
}