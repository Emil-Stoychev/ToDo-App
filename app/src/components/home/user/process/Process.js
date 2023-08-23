import { Task } from '../task/Task'
import styles from '../task/task.module.css'

const Process = ({currentTask, setCurrentTask}) => {
    return (
        <div className={styles.main}>
            <h2 className={styles.header}>PROCESS {currentTask?.inProgress?.length}</h2>

            <div className={styles.tasks}>

            {currentTask?.inProgress?.map(x => <Task key={x._id} x={x} currentTask={currentTask} setCurrentTask={setCurrentTask} />)}

            </div>
        </div>
    )
}

export default Process