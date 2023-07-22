import { useNavigate } from 'react-router-dom'
import styles from './guest.module.css'

const Guest = () => {
    const navigate = useNavigate()

    return (
        <div className={styles.main}>

            <h1 className={styles.header}>ToDo App and our mission!</h1>

            <div>

                <div className={styles.cont}>
                    <div className={styles.box}>
                        <h2>You can create your own tasks, add people to work on them and more!</h2>
                    </div>

                    <div className={styles.boxImage}>
                        <img src='https://www.computerhope.com/jargon/t/task.png' alt='image' />
                    </div>
                </div>

                <hr className={styles.line}></hr>

                <div className={styles.cont}>
                    <div className={styles.box}>
                        <h2>You can create your own tasks, add people to work on them and more!</h2>
                    </div>

                    <div className={styles.boxImage}>
                        <img src='https://img.freepik.com/premium-vector/list-planning-concept-all-tasks-are-completed-paper-sheets-with-check-marks_183665-117.jpg' alt='image' />
                    </div>
                </div>

                <hr className={styles.line}></hr>

                <div className={styles.cont}>
                    <div className={styles.box}>
                        <h2>You can create your own tasks, add people to work on them and more!</h2>
                    </div>

                    <div className={styles.boxImage}>
                        <img src='https://img.freepik.com/free-vector/3d-cartoon-style-checklist-with-green-checkmark-icon-list-with-completed-tasks-white-background-flat-vector-illustration-success-productivity-management-achievement-concept_778687-983.jpg?w=2000' alt='image' />
                    </div>
                </div>

                <hr className={styles.line}></hr>

                <div className={styles.cont}>
                    <div className={styles.box}>
                        <h2>You can create your own tasks, add people to work on them and more!</h2>
                    </div>

                    <div className={styles.boxImage}>
                        <img src='https://images.ctfassets.net/rz1oowkt5gyp/1IgVe0tV9yDjWtp68dAZJq/36ca564d33306d407dabe39c33322dd9/TaskManagement-hero.png' alt='image' />
                    </div>
                </div>

                <hr className={styles.line}></hr>

                <div className={styles.cont}>
                    <div className={styles.box}>
                        <h2>You can create your own tasks, add people to work on them and more!</h2>
                    </div>

                    <div className={styles.boxImage}>
                        <img src='https://flow-e.com/wp-content/uploads/bfi_thumb/Google-task-list-379tmv50jkyo35v5zqpoui.png' alt='image' />
                    </div>
                </div>

                <hr className={styles.lineEnd}></hr>

                <div className={styles.contEnd}>
                    <div className={styles.boxEnd}>
                        <h2>What are you waiting for?</h2>
                    </div>

                    <div className={styles.buttons}>
                        <button onClick={() => navigate('/login')}>Login</button>
                        <button onClick={() => navigate('/register')}>Register</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Guest