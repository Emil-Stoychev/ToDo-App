import styles from './user.module.css'

import Process from './process/Process'
import Todo from './todo/Todo'
import Done from './done/Done'

const User = () => {
    return (
        <div className={styles.mainCont}>

            <select className={styles.selectTasks}>
                <option>First</option>
                <option>Second</option>
                <option>Third</option>
                <option>Some text here for option</option>
            </select>

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

            <form className={styles.createNone}>
                <div className={styles.divInputs}>
                    <label htmlFor='title'>Title</label>
                    <textarea id='title' ></textarea>
                </div>

                <h2>Add to:</h2>
                <select className={styles.selectTasks}>
                    <option>First</option>
                    <option>Second</option>
                    <option>Third</option>
                    <option>Some text here for option</option>
                </select>

                <button>Create</button>
            </form>

            <button className={styles.primaryBtn}>+</button>
        </div>
    )
}

export default User