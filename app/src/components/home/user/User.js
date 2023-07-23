import styles from './user.module.css'

import Process from './process/Process'
import Todo from './todo/Todo'
import Done from './done/Done'

const User = () => {
    return (
        <div className={styles.container}>

            <Todo />

            <hr className={styles.line} />

            <Process />

            <hr className={styles.line} />

            <Done />

            <div className={styles.sliders}>
                <button className={styles.arrowBtn}>&#8810;</button>
                <button className={styles.arrowBtn}>&#8811;</button>
            </div>

        </div>
    )
}

export default User