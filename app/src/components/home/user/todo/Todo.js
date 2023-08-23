import { Task } from '../task/Task'
import styles from '../task/task.module.css'


const Todo = ({currentTask, setCurrentTask}) => {

    return (
        <div className={styles.main}>
            <h2 className={styles.header}>TODO {currentTask?.todo?.length}</h2>

            <div className={styles.tasks}>

                {currentTask?.todo?.map(x => <Task key={x._id} x={x} currentTask={currentTask} setCurrentTask={setCurrentTask} />)}
                    
            </div>
        </div>
    )
}

export default Todo