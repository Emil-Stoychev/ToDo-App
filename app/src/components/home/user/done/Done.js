import { Task } from '../Task'
import styles from '../task.module.css'

const Done = ({currentTask, setCurrentTask}) => {
    return (
        <div className={styles.main}>
            <h2 className={styles.header}>DONE</h2>

            <div className={styles.tasks}>

            {currentTask?.done.map(x => <Task key={x._id} x={x} currentTask={currentTask} setCurrentTask={setCurrentTask} />)}

                
            </div>
        </div>
    )
}

export default Done