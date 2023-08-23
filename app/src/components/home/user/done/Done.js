import { Task } from '../task/Task'
import styles from '../task/task.module.css'

const Done = ({currentTask, setCurrentTask}) => {
    return (
        <div className={styles.main}>
            <h2 className={styles.header}>DONE {currentTask?.done?.length}</h2>

            <div className={styles.tasks}>

            {currentTask?.done?.map(x => <Task key={x._id} x={x} currentTask={currentTask} setCurrentTask={setCurrentTask} />)}

                
            </div>
        </div>
    )
}

export default Done