import styles from './task.module.css'

import * as taskService from '../../../../services/taskService'
import { format } from "timeago.js";
import { useContext, useState } from 'react'
import { AuthContext } from '../../../../context/authContext';
import { useNavigate } from 'react-router-dom';

export const Task = ({ x, currentTask, setCurrentTask }) => {
    const { user, setUser } = useContext(AuthContext);
    const [edit, setEdit] = useState({
        option: false,
        value: ''
    })
    const [taskInfo, setTaskInfo] = useState(false)
    const navigate = useNavigate()

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
                    if (!res.message) {
                        x.title = edit.value

                        setEdit({ option: false, value: '' })
                    } else {
                        console.log(res);
                    }
                })
        }
    }

    const onDeleteHandler = (taskId) => {
        taskService.deleteTask(taskId, currentTask?._id, localStorage.getItem('sessionStorage'))
            .then(res => {
                if (!res.message) {
                    setCurrentTask(state => ({
                        ...state,
                        todo: state.todo.filter(x => {
                            if (x?._id != taskId) {
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
                if (!res.message) {
                    setCurrentTask(res)
                } else {
                    console.log(res);
                }
            })
    }

    const changePriority = (taskId) => {
        if (x?.in != 'done') {
            taskService.changePriority(taskId, localStorage.getItem('sessionStorage'))
                .then(res => {
                    if (!res.message) {
                        if (x?.in == 'todo') {
                            setCurrentTask(state => ({
                                ...state,
                                todo: state.todo.map(y => {
                                    if (y?._id == taskId) {
                                        y.priority = res
                                    }

                                    return y
                                })
                            }))
                        } else if (x?.in == 'inProgress') {
                            setCurrentTask(state => ({
                                ...state,
                                inProgress: state.inProgress.map(y => {
                                    if (y?._id == taskId) {
                                        y.priority = res
                                    }

                                    return y
                                })
                            }))
                        }
                    } else {
                        console.log(res);
                    }
                })
        }
    }

    console.log(x);

    return (
        <>
            <div className={styles.task}>
                {taskInfo
                    ?
                    <div className={styles.taskInfo}>
                        <h2 onClick={() => setTaskInfo(false)} className={styles.taskInfoHistoryBtn}><svg fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg></h2>

                        <div className={styles.taskInfoSubDiv}>
                            <div>
                                <h2 className={styles.h2Header}>Created by:</h2>
                                <div className={styles.infoAuthor} onClick={() => navigate(`/profile/${x?.author?._id}`)}>
                                    <img src={x?.author.image} />
                                    <h2>{x?.author?.username} {x?.author?._id == user?._id && '(you)'}</h2>
                                </div>
                            </div>
                            <h3>Section: {x?.in}</h3>
                            <h3>Priority: {x?.priority}</h3>

                            {x?.workOnIt?.username &&
                                <div>
                                    <h2 className={styles.h2Header}>Work on it:</h2>
                                    <div className={styles.infoAuthor} onClick={() => navigate(`/profile/${x?.workOnIt?._id}`)}>
                                        <img src={x?.workOnIt?.image} />
                                        <h2>{x?.workOnIt?.username} {x?.workOnIt?._id == user?._id && '(you)'}</h2>
                                    </div>
                                </div>
                            }

                            <span className={styles.lastUpdatedAt}>Last update: {format(x?.updatedAt)}</span>
                        </div>

                        <span className={styles.timeAgo}>{format(x?.createdAt)}</span>
                    </div>
                    :
                    <>
                        <h2 onClick={() => setTaskInfo(true)} className={styles.taskInfoHistoryBtn}><svg fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg></h2>

                        {edit.option
                            ? <input value={edit.value} onChange={(e) => onChangeHandler(e)} />
                            : <h3 className={styles.taskHeader}>{x?.title}</h3>
                        }

                        <div className={styles.taskInfo}>
                            <div className={styles.priority}>
                                <h2><svg onClick={() => changePriority(x?._id)} fill={x?.priority == 'low' ? 'yellow' : x?.priority == 'medium' ? 'blue' : 'red'} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" /></svg></h2>
                            </div>

                            <div className={styles.author}>
                                <img src={x?.in != 'todo' ? x?.workOnIt?.image : x?.author.image} />

                                <div className={styles.taskBtns}>

                                    {edit.option
                                        ?
                                        <>
                                            <button onClick={() => setEdit({ option: false, value: '' })}><svg fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" /></svg></button>
                                            <button onClick={() => onEditHandler()}><svg fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" /></svg></button>
                                        </>
                                        :
                                        <>
                                            {x.in != 'todo'
                                                ? <button onClick={() => onMoveHandler(1)}><svg fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM217.4 376.9L117.5 269.8c-3.5-3.8-5.5-8.7-5.5-13.8s2-10.1 5.5-13.8l99.9-107.1c4.2-4.5 10.1-7.1 16.3-7.1c12.3 0 22.3 10 22.3 22.3l0 57.7 96 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32l-96 0 0 57.7c0 12.3-10 22.3-22.3 22.3c-6.2 0-12.1-2.6-16.3-7.1z" /></svg></button>
                                                :
                                                <>
                                                    <button onClick={() => setEdit({ option: true, value: x.title })} ><svg fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" /></svg></button>
                                                    {(x?.author?._id == user?._id || currentTask?.admins.some(y => y?._id == user?._id)) &&
                                                        <button onClick={() => onDeleteHandler(x?._id)}><svg fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" /></svg></button>
                                                    }
                                                </>
                                            }
                                            {x.in == 'done'
                                                ? <button onClick={() => onMoveHandler(0)}><svg fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" /></svg></button>
                                                : <button onClick={() => onMoveHandler(0)}><svg fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM294.6 135.1l99.9 107.1c3.5 3.8 5.5 8.7 5.5 13.8s-2 10.1-5.5 13.8L294.6 376.9c-4.2 4.5-10.1 7.1-16.3 7.1C266 384 256 374 256 361.7l0-57.7-96 0c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32l96 0 0-57.7c0-12.3 10-22.3 22.3-22.3c6.2 0 12.1 2.6 16.3 7.1z" /></svg></button>
                                            }
                                        </>
                                    }
                                </div>
                            </div>

                            <span className={styles.timeAgo}>{format(x?.createdAt)}</span>
                        </div>
                    </>
                }
            </div>
        </>
    )
}