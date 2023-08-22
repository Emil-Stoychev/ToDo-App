import styles from './task.module.css'

import * as taskService from '../../../services/taskService'
import { useState } from 'react'

export const Task = ({x, currentTask, setCurrentTask}) => {
    const [edit, setEdit] = useState({
        option: false,
        value: ''
    })

    const onChangeHandler = (e) => {
        setEdit((state) => ({
          ...state,
          value: e.target.value,
        }));
      };

    const onEditHandler = () => {
    if (edit.value.trim() != "" && edit.value.length > 3) {
        taskService.editTask(x._id, edit.value, localStorage.getItem('sessionStorage'))
            .then(res => {
                if(!res.message) {
                    x.title = edit.value

                    setEdit({option: false, value: ''})
                } else {
                    console.log(res);
                }
            })
    }
    }

    const onDeleteHandler = (taskId) => {
        taskService.deleteTask(taskId, currentTask?._id, localStorage.getItem('sessionStorage'))
            .then(res => {
                if(!res.message) {
                    setCurrentTask(state => ({
                        ...state,
                        todo: state.todo.filter(x => {
                            if(x?._id != taskId) {
                                return x
                            }
                        })
                    }))
                } else {
                    console.log(res);
                }
            })
    }

    const onMoveHandler = (num) => {
        taskService.moveTask(x._id, currentTask?._id, num, localStorage.getItem('sessionStorage'))
            .then(res => {
                if(!res.message) {
                    setCurrentTask(res)
                } else {
                    console.log(res);
                }
            })
    }

    return (
        <div className={styles.task}>
            {edit.option
                ? <input value={edit.value} onChange={(e) => onChangeHandler(e)} />
                : <h3 className={styles.taskHeader}>{x?.title}</h3>
            }

            <div className={styles.taskBtns}>
                {edit.option
                    ?
                    <>
                        <button onClick={() => setEdit({option: false, value: ''})}>X</button>
                        <button onClick={() => onEditHandler()}>✔</button>
                    </>
                    :
                    <>
                        {x.in != 'todo'
                            ? <button onClick={() => onMoveHandler(1)}><svg fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM217.4 376.9L117.5 269.8c-3.5-3.8-5.5-8.7-5.5-13.8s2-10.1 5.5-13.8l99.9-107.1c4.2-4.5 10.1-7.1 16.3-7.1c12.3 0 22.3 10 22.3 22.3l0 57.7 96 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32l-96 0 0 57.7c0 12.3-10 22.3-22.3 22.3c-6.2 0-12.1-2.6-16.3-7.1z"/></svg></button>
                            :
                            <>
                                <button onClick={() => setEdit({option: true, value: x.title})} ><svg fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" /></svg></button>
                                <button onClick={() => onDeleteHandler(x?._id)}>X</button>
                            </>
                            }
                            {x.in == 'done'
                                ? <button onClick={() => onMoveHandler(0)}>X</button>
                                : <button onClick={() => onMoveHandler(0)}><svg fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM294.6 135.1l99.9 107.1c3.5 3.8 5.5 8.7 5.5 13.8s-2 10.1-5.5 13.8L294.6 376.9c-4.2 4.5-10.1 7.1-16.3 7.1C266 384 256 374 256 361.7l0-57.7-96 0c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32l96 0 0-57.7c0-12.3 10-22.3 22.3-22.3c6.2 0 12.1 2.6 16.3 7.1z"/></svg></button>
                                }
                    </>
                    }
            </div>
        </div>
    )
}